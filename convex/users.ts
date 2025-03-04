import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

interface QueryCtx {
  db: any; // Replace with proper type from your Convex setup
  auth: any; // Replace with proper type from your Convex setup
}

interface User {
  _id: Id<"users">;
  email: string;
  createdAt: number;
  updatedAt: number;
  usageLimit: number;
  usageCount: number;
  teamId?: string;
  plan?: string;
}

export const getUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("_id"), args.userId))
      .first();
    return user;
  },
});

export const createUser = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    plan: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      usageLimit: 10,
      usageCount: 0,
    });
  },
}); 