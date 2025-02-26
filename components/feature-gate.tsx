"use client";

import { useSubscription } from "@/hooks/use-subscription";
import { ReactNode } from "react";

interface FeatureGateProps {
  feature: "pro" | "enterprise";
  children: ReactNode;
  fallback?: ReactNode;
}

export function FeatureGate({ feature, children, fallback }: FeatureGateProps) {
  const { hasProFeatures, hasEnterpriseFeatures } = useSubscription();

  if (feature === "enterprise" && !hasEnterpriseFeatures) {
    return fallback || null;
  }

  if (feature === "pro" && !hasProFeatures) {
    return fallback || null;
  }

  return <>{children}</>;
} 