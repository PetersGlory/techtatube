import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import { z } from "zod"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"
import claude from "@/lib/claude"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"),
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

    const { success } = await ratelimit.limit(userId)
    if (!success) {
      return new NextResponse("Rate limit exceeded", { status: 429 })
    }

    const json = await req.json()
    const body = generateSchema.parse(json)

    const { prompt, type, tone, length } = body

    const subscription = await convex.query(api.subscriptions.getSubscription, { userId })
    if (!subscription || subscription.status !== "active") {
      return new NextResponse("Subscription required", { status: 403 })
    }

    // Check usage limits
    const usage = await convex.query(api.usage.getUsage, { userId })
    if (usage.current >= usage.limit) {
      return new NextResponse("Usage limit reached", { status: 403 })
    }

    const completion = await claude.messages.create({
      messages: [
        {
          role: "user",
          content: `Generate a ${type} content with a ${tone} tone and ${length} length based on the following prompt: ${prompt}`,
        },
      ],
      model: "claude-2",
      max_tokens: 2000,
    })

    const generatedContent = completion.content[0].type === 'text' 
      ? completion.content[0].text 
      : "";

    // Save to Convex instead of Prisma
    await convex.mutation(api.content.createContent, {
      title: prompt.slice(0, 50),
      content: generatedContent,
      type,
      userId,
      isPublished: true,
    })
    // Increment usage after successful generation
    await convex.mutation(api.usage.incrementUsage, { userId })

    return NextResponse.json({ content: generatedContent })
  } catch (error) {
    console.error("Error:", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

