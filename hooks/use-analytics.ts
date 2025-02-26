import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useIdentify } from "@/lib/schematic";

export function useAnalytics() {
  const { user } = useUser();
  const identify = useIdentify();

  useEffect(() => {
    if (user) {
      void identify({
        email: user.emailAddresses[0].emailAddress,
        name: `${user.firstName} ${user.lastName}`,
        createdAt: user.createdAt,
      });
    }
  }, [user, identify]);
} 