import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./utils/requireAuth";
import { media } from "./schema";

// Query pour récupérer l'utilisateur connecté actuel
export const getMe = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx, false);

    if (!userId) {
      return null;
    }

    const [user, moments, persons, things, places] = await Promise.all([
      ctx.db.get(userId),
      ctx.db
        .query("moments")
        .withIndex("by_creator_and_status", (q) =>
          q.eq("creator_id", userId).eq("status", "unfinished")
        )
        .collect(),
      ctx.db
        .query("persons")
        .withIndex("by_creator_and_status", (q) =>
          q.eq("creator_id", userId).eq("status", "unfinished")
        )
        .collect(),
      ctx.db
        .query("things")
        .withIndex("by_creator_and_status", (q) =>
          q.eq("creator_id", userId).eq("status", "unfinished")
        )
        .collect(),
      ctx.db
        .query("places")
        .withIndex("by_creator_and_status", (q) =>
          q.eq("creator_id", userId).eq("status", "unfinished")
        )
        .collect(),
    ]);

    const unfinishedMemoriesCount =
      moments.length + persons.length + things.length + places.length;

    return { user, unfinishedMemoriesCount };
  },
});

export const editMe = mutation({
  args: {
    firstname: v.optional(v.string()),
    lastname: v.optional(v.string()),
    gender: v.optional(v.string()),
    medias: v.optional(v.array(media)),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx, true);

    const user = await ctx.db.get(userId);

    await ctx.db.patch(userId, { ...user, ...args });

    return { success: true };
  },
});

export const getMyStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const momentsCount = await ctx.db
      .query("moments")
      .filter((q) => q.eq(q.field("creator_id"), userId))
      .collect();

    return {
      momentsCount: momentsCount.length,
    };
  },
});
