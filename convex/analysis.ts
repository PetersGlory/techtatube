import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getVideoAnalysis = query({
  args: { videoId: v.id("videos") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("analysis")
      .filter((q) => q.eq(q.field("videoId"), args.videoId))
      .first();
  },
});

export const saveAnalysis = mutation({
  args: {
    videoId: v.id("videos"),
    analysis: v.object({
      summary: v.string(),
      keyPoints: v.array(v.string()),
      sentiment: v.string(),
      suggestedTags: v.array(v.string()),
      contentRating: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("analysis")
      .filter((q) => q.eq(q.field("videoId"), args.videoId))
      .first();

    if (existing) {
      return await ctx.db.patch(existing._id, {
        ...args.analysis,
        updatedAt: Date.now(),
      });
    }

    return await ctx.db.insert("analysis", {
      videoId: args.videoId,
      ...args.analysis,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
}); 