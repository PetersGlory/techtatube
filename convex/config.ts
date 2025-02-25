export default {
  providers: [
    {
      name: "clerk",
      domain: process.env.CLERK_DOMAIN || "https://your-app.clerk.accounts.dev",
      applicationID: process.env.CLERK_APPLICATION_ID,
    },
  ],
}; 