import type React from "react"
import { UserButton } from "@clerk/nextjs"
import { Toggle } from "@/components/ui/toggle"
import { OrgSwitcher } from "@/components/org-switcher"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <h1 className="text-2xl font-bold">TechtaTube</h1>
          <div className="flex items-center space-x-4">
            <OrgSwitcher />
            <Toggle />
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}