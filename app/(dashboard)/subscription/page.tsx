"use client";

import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { subscriptionPlans } from "@/config/subscriptions";
import { SubscriptionForm } from "@/components/subscription-form";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function SubscriptionPage() {
  const { userId } = useAuth();
  if (!userId) {
    redirect("/sign-in");
  }

  const user = useQuery(api.users.getUser, { userId });
  const subscription = useQuery(api.subscriptions.getSubscription, { userId });

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">Subscription Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subscriptionPlans.map((plan) => (
          <div key={plan.name} className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
            <p className="text-2xl font-bold mb-4">${plan.price}/month</p>
            <ul className="mb-4">
              {plan.features.map((feature) => (
                <li key={feature} className="mb-1">
                  • {feature}
                </li>
              ))}
            </ul>
            <SubscriptionForm
              planId={plan.stripePriceId ?? ""}
              isCurrentPlan={subscription?.stripePriceId === plan.stripePriceId}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

