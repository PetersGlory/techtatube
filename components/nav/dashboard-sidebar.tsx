"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  ScrollText, 
  History, 
  BarChart2, 
  Settings,
  Video,
  LineChart,
  CreditCard 
} from "lucide-react";
import { routes } from "@/lib/navigation";
import { useUser } from "@clerk/nextjs";

export const DashboardSidebar = () => {
  const pathname = usePathname();
  const { user } = useUser();

  const sidebarItems = [
    {
      title: "Videos",
      icon: <Video className="w-4 h-4" />,
      href: routes.videos,
      requiresAuth: true,
    },
    {
      title: "Analysis",
      icon: <LineChart className="w-4 h-4" />,
      href: routes.analysis,
      requiresAuth: true,
    },
    {
      title: "History",
      icon: <History className="w-4 h-4" />,
      href: "/history",
      requiresAuth: true,
    },
    {
      title: "Subscription",
      icon: <CreditCard className="w-4 h-4" />,
      href: routes.pricing,
      requiresAuth: false,
    },
  ];

  return (
    <div className="hidden md:flex h-screen w-64 flex-col fixed left-0 top-0 border-r bg-muted/10">
      <div className="p-6">
        <h2 className="text-lg font-semibold">Dashboard</h2>
      </div>
      <div className="flex-1 space-y-1 p-2">
        {sidebarItems.map((item) => {
          if (item.requiresAuth && !user) return null;
          
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2",
                  pathname === item.href && "bg-muted"
                )}
              >
                {item.icon}
                {item.title}
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 