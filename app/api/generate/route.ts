import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import { z } from "zod"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  analytics: true,
  prefix: "api_generate",
})

const generateSchema = z.object({
  prompt: z.string().min(1).max(1000),
  type: z.enum(["article", "social", "email", "video-script"]),
  tone: z.enum(["formal", "casual", "humorous", "professional"]),
  length: z.enum(["short", "medium", "long"]),
})

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { success, limit, reset, remaining } = await ratelimit.limit(userId)
    if (!success) {
      return new NextResponse(
        JSON.stringify({
          error: "Too Many Requests",
          limit,
          reset,
          remaining
        }), 
        { 
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString()
          }
        }
      )
    }

    const json = await req.json()
    const body = generateSchema.parse(json)
    const { prompt, type, tone, length } = body

    try {
      const subscription = await convex.query(api.subscriptions.getSubscription, { userId })
      
      if (subscription && subscription.status !== "active") {
        return new NextResponse(
          JSON.stringify({
            error: "Subscription required",
            status: subscription.status,
            message: "Please upgrade your plan to continue"
          }),
          { 
            status: 403,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      }
    } catch (error) {
      console.error("Subscription check error:", error)
    }

    const usage = await convex.query(api.usage.getUsage, { userId })
    if (usage.current >= usage.limit) {
      return new NextResponse(
        JSON.stringify({
          error: "Usage limit reached",
          current: usage.current,
          limit: usage.limit
        }),
        { 
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Generate content using Gemini
    const result = await model.generateContent(`Generate a ${type} content with a ${tone} tone and ${length} length based on the following prompt: ${prompt}`);
    const response = await result.response;
    const generatedContent = response.text();

    await Promise.all([
      convex.mutation(api.content.createContent, {
        title: prompt.slice(0, 50),
        content: generatedContent,
        type,
        userId,
        isPublished: true,
      }),
      convex.mutation(api.usage.incrementUsage, { userId })
    ])

    return NextResponse.json({
      content: generatedContent,
      usage: {
        current: usage.current + 1,
        limit: usage.limit,
        remaining: usage.limit - (usage.current + 1)
      }
    })

  } catch (error) {
    console.error("Generate error:", error)
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

