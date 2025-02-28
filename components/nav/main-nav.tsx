"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/navigation";
import { useUser } from "@clerk/nextjs";

export function MainNav() {
  const pathname = usePathname();
  const { user } = useUser();

  const navItems = [
    {
      href: routes.videos,
      label: "Videos",
      requiresAuth: true,
    },
    {
      href: routes.analysis,
      label: "Analysis",
      requiresAuth: true,
    },
    {
      href: routes.pricing,
      label: "Subscription",
      requiresAuth: false,
    },
  ];

  return (
    <nav className="flex items-center space-x-6">
      {navItems.map((item) => {
        if (item.requiresAuth && !user) return null;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === item.href
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
} 