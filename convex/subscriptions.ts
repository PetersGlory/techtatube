import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createSubscription = mutation({
  args: {
    userId: v.string(),
    status: v.string(),
    stripeCustomerId: v.string(),
    stripePriceId: v.string(),
    stripeSubscriptionId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("subscriptions", {
      ...args,
      currentPeriodEnd: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const getSubscription = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const subscription = await ctx.db
      .query("subscriptions")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();
    return subscription;
  },
}); 