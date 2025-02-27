import { UserButton } from "@clerk/nextjs";
import { MainNav } from "@/components/nav/main-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <MainNav />
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}