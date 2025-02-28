export default {
  providers: [
    {
      name: "clerk",
      domain: process.env.CLERK_DOMAIN || "https://heroic-ghost-42.clerk.accounts.dev",
      applicationID: process.env.CLERK_APPLICATION_ID,
    },
  ],
}; 