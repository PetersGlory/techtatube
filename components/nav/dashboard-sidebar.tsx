"use client";

import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  ScrollText, 
  History, 
  BarChart2, 
  Settings,
  Video,
  LineChart,
  CreditCard, 
  Home,
  LogOut
} from "lucide-react";
import { routes } from "@/lib/navigation";
import { useUser } from "@clerk/nextjs";

export const DashboardSidebar = ({isOpened}: {isOpened: boolean}) => {
  const pathname = usePathname();
  const { user } = useUser();
  const router = useRouter();

  const sidebarItems = [
    {
      title: "Home",
      icon: <Home className="w-4 h-4" />,
      href: routes.dashboard,
      requiresAuth: true,
    },
    {
      title: "My Videos",
      icon: <Video className="w-4 h-4" />,
      href: routes.videos,
      requiresAuth: true,
    },
    {
      title: "My Content",
      icon: <ScrollText className="w-4 h-4" />,
      href: "/content/generate",
      requiresAuth: true,
    },
    {
      title: "Video Analysis",
      icon: <LineChart className="w-4 h-4" />,
      href: routes.analysis,
      requiresAuth: true,
    },
    {
      title: "Processing History",
      icon: <History className="w-4 h-4" />,
      href: "/history",
      requiresAuth: true,
    },
    {
      title: "Manage Subscription",
      icon: <CreditCard className="w-4 h-4" />,
      href: routes.pricing,
      requiresAuth: false,
    },
    // {
    //   title: "Settings",
    //   icon: <Settings className="w-4 h-4" />,
    //   href: "/settings",
    //   requiresAuth: true,
    // },
  ];

  return (
    <div className={`md:flex h-screen w-64 flex-col fixed left-0 top-0 border-r bg-muted/10 ${isOpened ? "translate-x-0" : "translate-x-0"}`}>
      <div className="p-6 w-full flex flex-row items-center justify-between">
        <h2 className="text-lg font-semibold">Dashboard</h2>
        <Button variant="ghost" size="icon" className="items-center" onClick={()=> router.replace("/")}>
          <LogOut className="w-4 h-4 text-white" />
        </Button>
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