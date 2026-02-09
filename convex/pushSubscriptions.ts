import { mutation, internalQuery, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./utils/requireAuth";

export const saveToken = mutation({
  args: {
    fcmToken: v.string(),
    platform: v.union(v.literal("web"), v.literal("ios"), v.literal("android")),
    deviceName: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx, true);

    // Vérifier si ce token existe déjà
    const existing = await ctx.db
      .query("pushSubscriptions")
      .withIndex("by_fcmToken", (q) => q.eq("fcmToken", args.fcmToken))
      .first();

    if (existing) {
      // Mettre à jour les infos
      await ctx.db.patch(existing._id, {
        userId,
        deviceName: args.deviceName,
        userAgent: args.userAgent,
      });
      return existing._id;
    }

    // Créer un nouvel abonnement
    return await ctx.db.insert("pushSubscriptions", {
      userId,
      fcmToken: args.fcmToken,
      createdAt: Date.now(),
      platform: args.platform,
      deviceName: args.deviceName,
      userAgent: args.userAgent,
    });
  },
});

export const removeToken = mutation({
  args: { fcmToken: v.string() },
  handler: async (ctx, args) => {
    await requireAuth(ctx, true);

    const existing = await ctx.db
      .query("pushSubscriptions")
      .withIndex("by_fcmToken", (q) => q.eq("fcmToken", args.fcmToken))
      .first();
    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

// Internal query pour les actions serveur (crons, notifications)
export const getByUserInternal = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pushSubscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

// Internal mutation pour supprimer un token invalide (appelé par notifications.ts)
export const removeTokenInternal = internalMutation({
  args: { fcmToken: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("pushSubscriptions")
      .withIndex("by_fcmToken", (q) => q.eq("fcmToken", args.fcmToken))
      .first();
    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});
