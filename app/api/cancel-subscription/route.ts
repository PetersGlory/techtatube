import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { stripe } from "@/lib/stripe";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST() {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const subscription = await convex.query(api.subscriptions.getSubscription, { 
      userId 
    });

    if (!subscription) {
      return new NextResponse("No subscription found", { status: 404 });
    }

    await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);

    await convex.mutation(api.subscriptions.updateSubscription, {
      userId,
      status: "canceled",
    });

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 