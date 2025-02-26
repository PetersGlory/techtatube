import { UserButton } from "@clerk/nextjs";
import { useAuthState } from "@/lib/auth-context";

export function UserNav() {
  const { user } = useAuthState();

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col space-y-1">
        <p className="text-sm font-medium leading-none">{user?.firstName}</p>
        <p className="text-xs leading-none text-muted-foreground">
          {user?.emailAddresses[0].emailAddress}
        </p>
      </div>
      <UserButton 
        afterSignOutUrl="/"
        appearance={{
          elements: {
            avatarBox: "h-9 w-9"
          }
        }}
      />
    </div>
  );
}