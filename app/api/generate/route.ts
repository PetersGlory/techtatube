import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import { z } from "zod"
import claude from "@/lib/claude"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { prisma } from "@/lib/prisma"

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

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { subscription: true },
    })

    if (!user || !user.subscription || user.subscription.status !== "active") {
      return new NextResponse("Subscription required", { status: 403 })
    }

    const completion = await claude.complete({
      prompt: `Generate a ${type} content with a ${tone} tone and ${length} length based on the following prompt: ${prompt}`,
      max_tokens_to_sample: 2000,
      model: "claude-2",
    })

    const generatedContent = completion.completion

    // Save the generated content to the database
    await prisma.content.create({
      data: {
        title: prompt.slice(0, 50), // Use the first 50 characters of the prompt as the title
        body: generatedContent,
        type,
        userId: user.id,
      },
    })

    return NextResponse.json({ content: generatedContent })
  } catch (error) {
    console.error("Error:", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

