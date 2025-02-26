"use client";

import { ReactNode } from "react";
import { useRBAC } from "@/hooks/use-rbac";

interface RBACGateProps {
  children: ReactNode;
  allowedRoles?: string[];
  action?: string;
  fallback?: ReactNode;
}

export function RBACGate({ children, allowedRoles, action, fallback }: RBACGateProps) {
  const { role, can } = useRBAC();

  if (action && !can(action)) {
    return fallback || null;
  }

  if (allowedRoles && !allowedRoles.includes(role || "")) {
    return fallback || null;
  }

  return <>{children}</>;
}