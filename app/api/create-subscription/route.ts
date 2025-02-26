import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"
import { stripe } from "@/lib/stripe"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const user = await convex.query(api.users.getUser, { userId })
    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
      metadata: {
        userId: userId,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Error:", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

