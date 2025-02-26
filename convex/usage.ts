import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Export functions individually, not as default
export const getUsage = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();
    
    return {
      current: user?.usageCount ?? 0,
      limit: user?.usageLimit ?? 100,
    };
  },
});

export const incrementUsage = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, {
      usageCount: (user.usageCount || 0) + 1,
      updatedAt: Date.now(),
    });
  },
}); 