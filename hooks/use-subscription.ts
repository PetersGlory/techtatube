import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthState } from "@/lib/auth-context";
import { useFeatureFlag } from "@/lib/schematic";

export function useSubscription() {
  const { user } = useAuthState();
  const subscription = useQuery(api.subscriptions.getSubscription, {
    userId: user?.id ?? "",
  });
  
  const hasProFeatures = useFeatureFlag("pro-features");
  const hasEnterpriseFeatures = useFeatureFlag("enterprise-features");
  const createSubscription = useMutation(api.subscriptions.createSubscription);
  const updateSubscription = useMutation(api.subscriptions.updateSubscription);

  return {
    subscription,
    isActive: subscription?.status === "active",
    isPro: subscription?.stripePriceId === process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
    isEnterprise: subscription?.stripePriceId === process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID,
    hasProFeatures,
    hasEnterpriseFeatures,
    createSubscription,
    updateSubscription,
  };
} 