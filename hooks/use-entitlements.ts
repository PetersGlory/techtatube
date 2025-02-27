import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { EntitlementsResponse } from "@/convex/types";

export function useEntitlements() {
  const { user } = useUser();
  const userId = user?.id;

  const usage = useQuery(api.usage.getUsage,
    userId ? { userId } : "skip"
  );
  
  const hasFeatureAccess = async (feature: string) => {
    if (!userId || !usage) return false;
    return usage.current < usage.limit;
  };

  return {
    entitlements: usage,
    hasFeatureAccess,
    isLoading: !usage,
  };
} 