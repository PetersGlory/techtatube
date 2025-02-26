"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface AuthContextType {
  isLoading: boolean;
  hasSubscription: boolean;
  subscription: any;
  user: any;
}

const AuthContext = createContext<AuthContextType>({
  isLoading: true,
  hasSubscription: false,
  subscription: null,
  user: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  
  const subscription = useQuery(api.subscriptions.getSubscription, {
    userId: user?.id ?? "",
  });
  
  const createUser = useMutation(api.users.createUser);

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      createUser({
        userId: user.id,
        email: user.emailAddresses[0].emailAddress,
      });
      setIsLoading(false);
    }
  }, [isLoaded, isSignedIn, user, createUser]);

  return (
    <AuthContext.Provider
      value={{
        isLoading: !isLoaded || isLoading,
        hasSubscription: subscription?.status === "active",
        subscription,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthState = () => useContext(AuthContext); 