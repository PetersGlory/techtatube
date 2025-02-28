"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollText, History, BarChart2, Settings } from "lucide-react";

export const DashboardSidebar = () => {
  const pathname = usePathname();

  const sidebarItems = [
    {
      title: "Transcripts",
      icon: <ScrollText className="w-4 h-4" />,
      href: "/transcripts",
    },
    {
      title: "History",
      icon: <History className="w-4 h-4" />,
      href: "/history",
    },
    {
      title: "Analytics",
      icon: <BarChart2 className="w-4 h-4" />,
      href: "/analytics",
    },
    {
      title: "Settings",
      icon: <Settings className="w-4 h-4" />,
      href: "/settings",
    },
  ];

  return (
    <div className="hidden md:flex h-screen w-64 flex-col fixed left-0 top-0 border-r bg-muted/10">
      <div className="p-6">
        <h2 className="text-lg font-semibold">Dashboard</h2>
      </div>
      <div className="flex-1 space-y-1 p-2">
        {sidebarItems.map((item) => (
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
        ))}
      </div>
    </div>
  );
} 