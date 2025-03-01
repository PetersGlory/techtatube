import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";

function extractYoutubeId(url: string) {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export const api = {
  createVideo: mutation({
    args: {
      youtubeUrl: v.string(),
      userId: v.string(),
    },
    handler: async (ctx, args) => {
      const youtubeId = extractYoutubeId(args.youtubeUrl);
      if (!youtubeId) {
        throw new Error("Invalid YouTube URL");
      }

      const now = Date.now();
      return await ctx.db.insert("videos", {
        userId: args.userId as Id<"users">,
        youtubeUrl: args.youtubeUrl,
        youtubeId: youtubeId || "",
        status: "pending",
        createdAt: now,
        updatedAt: now,
      });
    },
  }),

  getUserVideos: query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
      const videos = await ctx.db
        .query("videos")
        .filter((q) => q.eq(q.field("userId"), args.userId))
        .order("desc")
        .collect();

      return videos.map(video => ({
        _id: video._id,
        _creationTime: video._creationTime,
        userId: video.userId,
        youtubeUrl: video.youtubeUrl,
        title: video.title,
        description: video.description,
        thumbnailUrl: video.thumbnailUrl,
        status: video.status as "pending" | "processing" | "completed" | "failed",
        createdAt: video.createdAt,
        updatedAt: video.updatedAt,
      }));
    },
  }),

  updateVideoMetadata: mutation({
    args: {
      videoId: v.id("videos"),
      title: v.string(),
      description: v.optional(v.string()),
      thumbnailUrl: v.optional(v.string()),
      duration: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
      await ctx.db.patch(args.videoId, {
        ...args,
        status: "processing",
        updatedAt: Date.now(),
      });
    },
  }),

  updateVideoStatus: mutation({
    args: {
      videoId: v.id("videos"),
      status: v.string(),
    },
    handler: async (ctx, args) => {
      const now = Date.now();
      await ctx.db.patch(args.videoId, {
        status: args.status,
        updatedAt: now,
      });
    },
  }),
}; 