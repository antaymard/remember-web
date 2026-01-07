import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./utils/requireAuth";
import { flexibleDateTime } from "./schema";

// Query pour lister toutes les personnes de l'utilisateur connecté
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx, true);

    const moments = await ctx.db
      .query("moments")
      .filter((q) => q.eq(q.field("creator_id"), userId))
      .order("desc")
      .collect();

    return moments;
  },
});

export const read = query({
  args: {
    _id: v.id("moments"),
  },
  handler: async (ctx, { _id }) => {
    const userId = await requireAuth(ctx, true);

    const moments = await ctx.db.get("moments", _id);

    if (!moments) {
      throw new ConvexError("Moment non trouvé");
    }
    if (moments.creator_id !== userId) {
      throw new ConvexError("Accès non autorisé");
    }

    return moments;
  },
});

export const edit = mutation({
  args: {
    _id: v.optional(v.id("moments")),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    is_secret: v.optional(v.boolean()),
    medias: v.optional(v.any()),
    date_time_in: v.optional(flexibleDateTime),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx, true);

    const { _id, ...data } = args;

    // Si _id existe, on édite
    if (_id) {
      const existing = await ctx.db.get(_id);

      if (!existing) {
        throw new ConvexError("Moment non trouvé");
      }

      if (existing.creator_id !== userId) {
        throw new ConvexError("Accès non autorisé");
      }

      await ctx.db.patch(_id, data);
      return _id;
    }

    // Sinon, on crée
    const newId = await ctx.db.insert("moments", {
      ...data,
      creator_id: userId,
    });

    return newId;
  },
});
