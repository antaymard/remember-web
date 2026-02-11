import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./utils/requireAuth";
import { flexibleDateTime } from "./schema";
import { commonMemoryFields } from "./validators";

// Query pour lister toutes les personnes de l'utilisateur connecté
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx, true);

    const persons = await ctx.db
      .query("persons")
      .filter((q) => q.eq(q.field("creator_id"), userId))
      .collect();

    return persons;
  },
});

// Query pour récupérer une personne spécifique
export const read = query({
  args: { _id: v.id("persons") },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx, true);

    const person = await ctx.db.get(args._id);

    if (!person) {
      throw new ConvexError("Personne non trouvée");
    }

    // Vérifier que l'utilisateur est bien le créateur
    if (person.creator_id !== userId) {
      throw new ConvexError("Accès non autorisé");
    }

    return person;
  },
});

export const edit = mutation({
  args: {
    _id: v.optional(v.id("persons")),
    firstname: v.string(),
    lastname: v.string(),
    type: v.union(v.literal("animal"), v.literal("human")),
    gender: v.optional(v.string()),
    relation_type: v.optional(v.string()),
    relation_name: v.optional(v.string()),
    ...commonMemoryFields,
    birth_date: v.optional(flexibleDateTime),
    death_date: v.optional(flexibleDateTime),
    first_met: v.optional(flexibleDateTime),
    last_seen: v.optional(flexibleDateTime),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx, true);

    const { _id, ...data } = args;
    const now = Date.now();

    // Si _id existe, on édite
    if (_id) {
      const existing = await ctx.db.get(_id);

      if (!existing) {
        throw new ConvexError("Personne non trouvée");
      }

      if (existing.creator_id !== userId) {
        throw new ConvexError("Accès non autorisé");
      }

      await ctx.db.patch(_id, { ...data, updated_at: now });
      return _id;
    }

    // Sinon, on crée
    const newId = await ctx.db.insert("persons", {
      ...data,
      creator_id: userId,
      updated_at: now,
    });

    return newId;
  },
});
