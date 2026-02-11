import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./utils/requireAuth";
import { flexibleDateTime } from "./schema";
import { titledMemoryFields } from "./validators";

const item = "things" as const;

// Query pour lister toutes les personnes de l'utilisateur connecté
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx, true);

    const moments = await ctx.db
      .query(item)
      .filter((q) => q.eq(q.field("creator_id"), userId))
      .order("desc")
      .collect();

    return moments;
  },
});

export const read = query({
  args: {
    _id: v.id(item),
  },
  handler: async (ctx, { _id }) => {
    const userId = await requireAuth(ctx, true);

    const place = await ctx.db.get(item, _id);

    if (!place) {
      throw new ConvexError("Place non trouvée");
    }
    if (place.creator_id !== userId) {
      throw new ConvexError("Accès non autorisé");
    }

    return place;
  },
});

export const edit = mutation({
  args: {
    _id: v.optional(v.id(item)),
    ...titledMemoryFields,
    type: v.union(
      v.literal("physical"),
      v.literal("music"),
      v.literal("film"),
      v.literal("book"),
      v.literal("game"),
      v.literal("interest"),
      v.literal("personality"),
    ),
    first_met: v.optional(flexibleDateTime),
    last_seen: v.optional(flexibleDateTime),
    updated_at: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx, true);

    const { _id, ...data } = args;
    const now = Date.now();

    // Si _id existe, on édite
    if (_id) {
      const existing = await ctx.db.get(_id);

      if (!existing) {
        throw new ConvexError("Place non trouvé");
      }

      if (existing.creator_id !== userId) {
        throw new ConvexError("Accès non autorisé");
      }

      await ctx.db.patch(_id, { ...data, updated_at: now });
      return _id;
    }

    // Sinon, on crée
    const newId = await ctx.db.insert(item, {
      ...data,
      creator_id: userId,
      updated_at: now,
    });

    return newId;
  },
});
