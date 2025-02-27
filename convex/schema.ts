import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(),
    email: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    usageLimit: v.number(),
    usageCount: v.number(),
    teamId: v.optional(v.string()),
  }),

  teams: defineTable({
    name: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  content: defineTable({
    title: v.string(),
    content: v.string(),
    type: v.string(),
    userId: v.string(),
    teamId: v.optional(v.string()),
    isPublished: v.boolean(),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  subscriptions: defineTable({
    userId: v.string(),
    status: v.string(),
    stripeCustomerId: v.string(),
    stripePriceId: v.string(),
    stripeSubscriptionId: v.string(),
    currentPeriodEnd: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  system_settings: defineTable({
    key: v.string(),
    value: v.any(),
    createdAt: v.number(),
  }),

  analytics: defineTable({
    userId: v.string(),
    contentId: v.string(),
    views: v.number(),
    engagement: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  videos: defineTable({
    userId: v.string(),
    youtubeUrl: v.string(),
    youtubeId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    duration: v.optional(v.string()),
    status: v.string(), // "pending", "processing", "completed", "failed"
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  transcripts: defineTable({
    videoId: v.id("videos"),
    userId: v.string(),
    content: v.string(),
    language: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  generatedTitles: defineTable({
    videoId: v.id("videos"),
    userId: v.string(),
    title: v.string(),
    score: v.optional(v.number()),
    isSelected: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  generatedImages: defineTable({
    videoId: v.id("videos"),
    userId: v.string(),
    url: v.string(),
    prompt: v.string(),
    isSelected: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  userEntitlements: defineTable({
    userId: v.string(),
    plan: v.string(), // "free", "pro", "enterprise"
    features: v.array(v.string()), // ["title_generation", "image_generation", etc]
    monthlyQuota: v.number(),
    usageCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  generationJobs: defineTable({
    userId: v.string(),
    videoId: v.id("videos"),
    type: v.string(), // "title", "image", "transcript"
    status: v.string(), // "pending", "processing", "completed", "failed"
    result: v.optional(v.string()),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  analysis: defineTable({
    videoId: v.id("videos"),
    summary: v.string(),
    keyPoints: v.array(v.string()),
    sentiment: v.string(),
    suggestedTags: v.array(v.string()),
    contentRating: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),
}); 