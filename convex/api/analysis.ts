import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

export const api = {
  getVideoAnalysis: query({
    args: { videoId: v.id("videos") },
    handler: async (ctx, args) => {
      return await ctx.db
        .query("analysis")
        .filter((q) => q.eq(q.field("videoId"), args.videoId))
        .first();
    },
  }),

  getVideoAnalyses: query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
      if (args.userId === "skip") return [];
      
      // Get all analyses and join with videos to filter by userId
      const analyses = await ctx.db
        .query("analysis")
        .collect();

      const videos = await ctx.db
        .query("videos")
        .filter((q) => q.eq(q.field("userId"), args.userId))
        .collect();

      const videoIds = new Set(videos.map(v => v._id));
      
      return analyses.filter(analysis => videoIds.has(analysis.videoId));
    },
  }),

  saveAnalysis: mutation({
    args: {
      videoId: v.id("videos"),
      analysis: v.object({
        summary: v.string(),
        keyPoints: v.array(v.string()),
        sentiment: v.string(),
        contentRating: v.string(),
        suggestedTags: v.array(v.string()),
      }),
    },
    handler: async (ctx, args) => {
      const now = Date.now();
      return await ctx.db.insert("analysis", {
        videoId: args.videoId,
        ...args.analysis,
        createdAt: now,
        updatedAt: now,
      });
    },
  }),
};