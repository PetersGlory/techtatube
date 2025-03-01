import { Id } from "../_generated/dataModel";
import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const api = {
  updateUserPlan: mutation({
    args: {
      userId: v.string(),
      plan: v.string(), // "starter", "pro", "enterprise"
    },
    handler: async (ctx, args) => {
      await ctx.db.patch(args.userId as Id<"users">, {
        plan: args.plan || "",
      });
    },
  }),
}; 