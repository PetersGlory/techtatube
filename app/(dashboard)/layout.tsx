import { UserButton } from "@clerk/nextjs";
import { MainNav } from "@/components/nav/main-nav";
import { DashboardSidebar } from "@/components/nav/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col md:pl-64">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center justify-between">
            {/* <MainNav /> */}
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>
        <main className="flex-1 md:px-16 px-4">{children}</main>
      </div>
    </div>
  );
}