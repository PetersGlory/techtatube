"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { routes } from "@/lib/navigation";

export function AuthRedirect() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push(routes.dashboard);
    }
  }, [isSignedIn, router]);

  return null;
} 