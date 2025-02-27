"use client";

import { useSignIn } from "@clerk/nextjs";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast-utils";

export function ClerkElements() {
  const { signIn, isLoaded } = useSignIn();

  useEffect(() => {
    if (isLoaded && signIn?.supportedFirstFactors) {
      // Check for WebAuthn support
      const webAuthn = signIn.supportedFirstFactors.find(
        (factor) => factor.strategy === "web3_metamask_signature"
      );
      if (webAuthn) {
        showToast.info("WebAuthn Supported", "You can use secure authentication");
      }
    }
  }, [isLoaded, signIn]);

  const handleSecureSignIn = async () => {
    if (!signIn) return;
    try {
      await signIn.create({
        strategy: "oauth_google",
        redirectUrl: "/dashboard",
      });
      showToast.success("Success", "Authentication successful");
    } catch (err) {
      showToast.error("Error", "Failed to authenticate");
    }
  };

  return (
    <div className="space-y-4">
      <Button 
        onClick={handleSecureSignIn}
        className="w-full"
        disabled={!isLoaded}
      >
        Sign in Securely
      </Button>
    </div>
  );
} 