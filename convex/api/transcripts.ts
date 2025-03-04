import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

export const api = {
  createTranscript: mutation({
    args: {
      videoId: v.id("videos"),
      userId: v.string(),
      content: v.string(),
      language: v.string(),
    },
    handler: async (ctx, args) => {
      const now = Date.now();
      return await ctx.db.insert("transcripts", {
        ...args,
        createdAt: now,
        updatedAt: now,
      });
    },
  }),

  getVideoTranscript: query({
    args: { videoId: v.id("videos") },
    handler: async (ctx, args) => {
      return await ctx.db
        .query("transcripts")
        .filter((q) => q.eq(q.field("videoId"), args.videoId))
        .first();
    },
  }),
}; 