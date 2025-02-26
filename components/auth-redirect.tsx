"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function AuthRedirect() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const createUser = useMutation(api.users.createUser);

  useEffect(() => {
    if (isSignedIn && user) {
      createUser({ 
        userId: user.id,
        email: user.emailAddresses[0].emailAddress 
      });
      router.push("/dashboard");
    }
  }, [isSignedIn, user, router, createUser]);

  return null;
} 