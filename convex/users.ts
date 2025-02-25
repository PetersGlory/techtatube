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
}

export const getUser = query({
  args: { userId: v.string() },
  handler: async (ctx: QueryCtx, args: { userId: string }) => {
    return await ctx.db
      .query("users")
      .filter((q: any) => q.eq(q.field("_id"), args.userId))
      .first();
  },
});

export const createUser = mutation({
  args: {
    email: v.string(),
    userId: v.string(),
  },
  handler: async (
    ctx: QueryCtx,
    args: { email: string; userId: string }
  ): Promise<Id<"users">> => {
    const user = await ctx.db.insert("users", {
      email: args.email,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      usageLimit: 10,
      usageCount: 0,
    });
    return user;
  },
}); 