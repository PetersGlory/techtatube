import { UserProfile } from "@clerk/nextjs";

export default function AccountPage() {
  return (
    <div className="container py-8">
      <UserProfile 
        appearance={{
          elements: {
            rootBox: "mx-auto max-w-3xl",
            card: "shadow-lg rounded-xl border bg-card",
          }
        }}
      />
    </div>
  );
}