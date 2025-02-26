import { authMiddleware, clerkClient } from "@clerk/nextjs";
 
export default authMiddleware({
  publicRoutes: ["/", "/api/webhook/stripe"],
  signInUrl: "/dashboard",
  ignoredRoutes: ["/api/webhook/stripe"],
  afterAuth: async (auth, req) => {
    if (auth.userId && auth.orgId) {
      const user = await clerkClient.users.getUser(auth.userId);
      const org = await clerkClient.organizations.getOrganization({ organizationId: auth.orgId });
      
      // You can set custom roles and permissions here
      auth.sessionClaims = {
        ...auth.sessionClaims,
        role: user.publicMetadata.role || "member",
        orgRole: auth.orgRole,
      };
    }
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};