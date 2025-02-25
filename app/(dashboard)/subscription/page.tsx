import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { subscriptionPlans } from "@/config/subscriptions"
import { SubscriptionForm } from "@/components/subscription-form"

export default async function SubscriptionPage() {
  const { userId } = auth()
  if (!userId) {
    redirect("/sign-in")
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { subscription: true },
  })

  if (!user) {
    return <div>User not found</div>
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
              planId={plan.stripePriceId}
              isCurrentPlan={user.subscription?.plan === plan.name.toLowerCase()}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

