export const subscriptionPlans = [
  {
    name: "Basic",
    price: 9.99,
    features: ["100 generations/month", "Basic AI models", "Email support"],
    stripePriceId: process.env.STRIPE_BASIC_PRICE_ID,
  },
  {
    name: "Pro",
    price: 29.99,
    features: ["Unlimited generations", "Advanced AI models", "Priority support"],
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID,
  },
  {
    name: "Enterprise",
    price: 99.99,
    features: ["Custom AI models", "API access", "Dedicated account manager"],
    stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
  },
]

