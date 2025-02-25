import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
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

  contents: defineTable({
    title: v.string(),
    content: v.string(),
    type: v.string(), // text, image, video
    createdAt: v.number(),
    updatedAt: v.number(),
    userId: v.string(),
    teamId: v.optional(v.string()),
    isPublished: v.boolean(),
    metadata: v.optional(v.any()),
  }),

  subscriptions: defineTable({
    userId: v.string(),
    stripeCustomerId: v.string(),
    stripePriceId: v.string(),
    stripeSubscriptionId: v.string(),
    status: v.string(),
    currentPeriodEnd: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  system_settings: defineTable({
    key: v.string(),
    value: v.any(),
    createdAt: v.number(),
  }),
}); 