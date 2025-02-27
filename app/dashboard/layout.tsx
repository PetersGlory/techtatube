import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { MainNav } from "@/components/nav/main-nav";
import { routes } from "@/lib/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();
  if (!userId) redirect(routes.auth.signIn);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1 container py-6">{children}</main>
    </div>
  );
} 