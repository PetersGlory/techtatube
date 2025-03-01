import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getContentByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const content = await ctx.db
      .query("content")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
    return content;
  },
});

export const createContent = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    type: v.string(),
    userId: v.string(),
    isPublished: v.boolean(),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const contentId = await ctx.db.insert("content", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return contentId;
  },
});

export const getAnalytics = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const analytics = await ctx.db
      .query("analytics")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
    return analytics;
  },
});

export const deleteContent = mutation({
  args: { id: v.id("content") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const updateContent = mutation({
  args: {
    id: v.id("content"),
    title: v.string(),
    content: v.string(),
    type: v.string(),
    isPublished: v.boolean(),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, {
      ...rest,
      updatedAt: Date.now(),
    });
  },
}); 

export const getContentById = query({
  args: { contentId: v.id("content") },
  handler: async (ctx, args) => {
    const content = await ctx.db.get(args.contentId);
    return content || null; // Return null if no content found
  },
}); 