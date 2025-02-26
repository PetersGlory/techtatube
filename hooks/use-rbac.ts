
import { useAuth } from "@clerk/nextjs";
import React from "react";

type Role = "admin" | "member" | "viewer";

export function useRBAC() {
  const { getToken } = useAuth();
  
  // Create state to store the role information
  const [roleInfo, setRoleInfo] = React.useState<{
    role: Role | undefined;
    orgRole: string | undefined;
  }>({
    role: undefined,
    orgRole: undefined
  });

  // Use effect to fetch the token asynchronously
  React.useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await getToken();
        const sessionClaims = token ? JSON.parse(token) : null;
        
        setRoleInfo({
          role: sessionClaims?.role as Role,
          orgRole: sessionClaims?.orgRole
        });
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    fetchToken();
  }, [getToken]);

  const can = (action: string) => {
    switch (roleInfo.role) {
      case "admin":
        return true;
      case "member":
        return ["read", "create", "update"].includes(action);
      case "viewer":
        return ["read"].includes(action);
      default:
        return false;
    }
  };

  return {
    role: roleInfo.role,
    orgRole: roleInfo.orgRole,
    can,
    isAdmin: roleInfo.role === "admin",
    isMember: roleInfo.role === "member",
    isViewer: roleInfo.role === "viewer",
  };
}