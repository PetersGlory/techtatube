import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"
import type Stripe from "stripe"
import { stripe } from "@/lib/stripe"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
    const userId = session.metadata?.userId

    if (!userId) {
      return new NextResponse("Missing user ID in metadata", { status: 400 })
    }

    await convex.mutation(api.subscriptions.createSubscription, {
      userId,
      status: subscription.status,
      stripeCustomerId: session.customer as string,
      stripePriceId: process.env.STRIPE_PRICE_ID!,
      stripeSubscriptionId: subscription.id,
    })
  }

  return new NextResponse(null, { status: 200 })
}

