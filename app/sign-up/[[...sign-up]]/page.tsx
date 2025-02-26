import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUp 
        appearance={{
          elements: {
            rootBox: "mx-auto max-w-[440px] w-full",
            card: "shadow-lg rounded-xl border bg-card",
          }
        }}
      />
    </div>
  );
}
