import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

export const api = {
  getUserEntitlements: query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
      // First check subscription status
      const subscription = await ctx.db
        .query("subscriptions")
        .filter((q) => q.eq(q.field("userId"), args.userId))
        .first();

      // Get user entitlements
      const entitlements = await ctx.db
        .query("userEntitlements")
        .filter((q) => q.eq(q.field("userId"), args.userId))
        .first();

      if (!entitlements) {
        // Return default free tier entitlements
        return {
          plan: "free",
          features: ["video_processing"],
          monthlyQuota: 5,
          usageCount: 0,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
      }

      return entitlements;
    },
  }),

  incrementUsage: mutation({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
      const entitlements = await ctx.db
        .query("userEntitlements")
        .filter((q) => q.eq(q.field("userId"), args.userId))
        .first();

      if (entitlements) {
        await ctx.db.patch(entitlements._id, {
          usageCount: entitlements.usageCount + 1,
          updatedAt: Date.now(),
        });
      } else {
        // Create new entitlements record with incremented usage
        await ctx.db.insert("userEntitlements", {
          userId: args.userId,
          plan: "free",
          features: ["video_processing"],
          monthlyQuota: 5,
          usageCount: 1,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }
    },
  }),

  checkFeatureAccess: mutation({
    args: { 
      userId: v.string(),
      feature: v.string(),
    },
    handler: async (ctx, args) => {
      const entitlements = await ctx.db
        .query("userEntitlements")
        .filter((q) => q.eq(q.field("userId"), args.userId))
        .first();

      if (!entitlements) {
        // Free tier access check
        return args.feature === "video_processing";
      }

      return entitlements.features.includes(args.feature) && 
             entitlements.usageCount < entitlements.monthlyQuota;
    },
  }),
}; 