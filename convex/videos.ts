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

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Create video record
    const videoId = await ctx.db.insert("videos", {
      userId: user._id,
      youtubeUrl: args.youtubeUrl,
      youtubeId: youtubeId || "", // Empty title initially, will be updated with metadata
      status: "processing",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Now use the user._id for the patch
    await ctx.db.patch(user._id, {
      usageCount: (user.usageCount || 0) + 1,
    });

    return videoId;
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

export const getVideo = query({
  args: { videoId: v.id("videos") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("videos")
      .filter((q) => q.eq(q.field("_id"), args.videoId))
      .first();
  },
}); 