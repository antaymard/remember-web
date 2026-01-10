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

// Query pour lister tous les utilisateurs (pour recherche d'amis)
export const listAllUsers = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Récupérer tous les utilisateurs sauf l'utilisateur actuel
    const allUsers = await ctx.db.query("users").collect();
    const otherUsers = allUsers.filter((user) => user._id !== userId);

    return otherUsers;
  },
});

// Query pour lister ses amis
export const listMyFriends = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user?.friends || user.friends.length === 0) {
      return [];
    }

    // Récupérer les informations de chaque ami
    const friends = await Promise.all(
      user.friends.map((friendId) => ctx.db.get(friendId))
    );

    return friends.filter((friend) => friend !== null);
  },
});

// Mutation pour ajouter un ami
export const addFriend = mutation({
  args: {
    friendId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx, true);

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Vérifier que l'ami existe
    const friend = await ctx.db.get(args.friendId);
    if (!friend) {
      throw new Error("Friend not found");
    }

    // Vérifier qu'on n'ajoute pas soi-même
    if (userId === args.friendId) {
      throw new Error("Cannot add yourself as a friend");
    }

    // Vérifier que l'ami n'est pas déjà dans la liste
    if (user.friends?.includes(args.friendId)) {
      return { success: true, message: "Already friends" };
    }

    // Ajouter l'ami
    const currentFriends = user.friends || [];
    await ctx.db.patch(userId, {
      friends: [...currentFriends, args.friendId],
    });

    return { success: true };
  },
});

// Mutation pour retirer un ami
export const removeFriend = mutation({
  args: {
    friendId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx, true);

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Retirer l'ami de la liste
    const currentFriends = user.friends || [];
    await ctx.db.patch(userId, {
      friends: currentFriends.filter((id) => id !== args.friendId),
    });

    return { success: true };
  },
});
