"use client";

import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast-utils";
import { routes } from "@/lib/navigation";

export function ClerkElements() {
  const { signIn, isLoaded } = useSignIn();
  const router = useRouter();

  const handleSecureSignIn = async () => {
    if (!signIn) return;
    try {
      await signIn.create({
        strategy: "oauth_google",
        redirectUrl: routes.dashboard,
      });
      showToast.success("Success", "Authentication successful");
      router.push(routes.dashboard);
    } catch (err) {
      showToast.error("Error", "Failed to authenticate");
    }
  };

  return (
    <Button 
      onClick={handleSecureSignIn}
      className="w-full"
      disabled={!isLoaded}
    >
      Sign in Securely
    </Button>
  );
} 