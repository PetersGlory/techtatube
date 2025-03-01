"use client";

import { UserButton } from "@clerk/nextjs";
import { MainNav } from "@/components/nav/main-nav";
import { DashboardSidebar } from "@/components/nav/dashboard-sidebar";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="w-full flex min-h-screen">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out md:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <DashboardSidebar isOpened={isSidebarOpen} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:pl-64">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center justify-between">
            {/* Hamburger Menu for Mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>

            {/* <MainNav /> */}
            <div className="hidden md:flex"></div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>
        <main className="flex-1 md:px-16 px-4">{children}</main>
      </div>
    </div>
  );
}