import { SignIn } from "@clerk/nextjs";

export function generateStaticParams() {
  return [
    { "sign-in": [] },
    { "sign-in": ["callback"] }
  ];
}

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignIn 
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