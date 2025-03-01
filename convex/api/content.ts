import { query } from "../_generated/server";
import { v } from "convex/values";

export const api = {
  getContentById: query({
    args: { contentId: v.id("content") },
    handler: async (ctx, args) => {
      const content = await ctx.db.get(args.contentId);
      return content || null; // Return null if no content found
    },
  }),
}