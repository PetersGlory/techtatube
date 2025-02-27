import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

export const api = {
  getUsage: query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
      const usage = await ctx.db
        .query("userEntitlements")
        .filter((q) => q.eq(q.field("userId"), args.userId))
        .first();
      return {
        current: usage?.usageCount ?? 0,
        limit: usage?.monthlyQuota ?? 5,
      };
    },
  }),

  checkFeatureAccess: query({
    args: { userId: v.string(), feature: v.string() },
    handler: async (ctx, args) => {
      const usage = await ctx.db
        .query("userEntitlements")
        .filter((q) => q.eq(q.field("userId"), args.userId))
        .first();
      return usage ? usage.usageCount < (usage.monthlyQuota ?? 5) : false;
    },
  }),

  incrementUsage: mutation({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
      const usage = await ctx.db
        .query("userEntitlements")
        .filter((q) => q.eq(q.field("userId"), args.userId))
        .first();
      if (usage) {
        await ctx.db.patch(usage._id, {
          usageCount: usage.usageCount + 1,
        });
      }
    },
  }),
}; 