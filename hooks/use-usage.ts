import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthState } from "@/lib/auth-context";

export function useUsage() {
  const { user } = useAuthState();
  const usage = useQuery(api.usage.getUsage, { 
    userId: user?.id ?? "" 
  });
  const incrementUsage = useMutation(api.usage.incrementUsage);

  return {
    usage,
    incrementUsage: () => incrementUsage({ userId: user?.id ?? "" }),
    hasReachedLimit: (usage?.current ?? 0) >= (usage?.limit ?? 0),
    remainingUsage: Math.max(0, (usage?.limit ?? 0) - (usage?.current ?? 0)),
  };
} 