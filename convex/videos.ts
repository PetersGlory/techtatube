import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Function to extract YouTube ID from URL
function extractYoutubeId(url: string) {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export const createVideo = mutation({
  args: {
    youtubeUrl: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const youtubeId = extractYoutubeId(args.youtubeUrl);
    if (!youtubeId) {
      throw new Error("Invalid YouTube URL");
    }

    return await ctx.db.insert("videos", {
      userId: args.userId,
      youtubeUrl: args.youtubeUrl,
      youtubeId,
      title: "", // Will be updated after fetching metadata
      status: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const getUserVideos = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("videos")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .collect();
  },
});

export const updateVideoMetadata = mutation({
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
});

export const updateVideoStatus = mutation({
  args: {
    videoId: v.id("videos"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.videoId, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
}); 