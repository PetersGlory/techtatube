import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const api = {
    create: mutation({
        args: {
            videoId: v.id("videos"),
            userId: v.id("users"),
            type: v.string(), // "title" | "image"
        },
        handler: async (ctx, args) => {
            const now = Date.now();
            return await ctx.db.insert("generationJobs", {
                ...args,
                status: "pending",
                createdAt: now,
                updatedAt: now,
                result: null,
                metadata: null,
            });
        },
    }),
};