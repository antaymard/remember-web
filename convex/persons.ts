import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./utils/requireAuth";

// Schema pour les dates partielles
const partialDateSchema = v.object({
  year: v.number(),
  month: v.optional(v.number()),
  day: v.optional(v.number()),
});

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
export const get = query({
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

// Mutation pour créer une nouvelle personne
export const create = mutation({
  args: {
    first_name: v.string(),
    last_name: v.string(),
    birth_date: v.optional(partialDateSchema),
    death_date: v.optional(partialDateSchema),
    first_seen: v.optional(partialDateSchema),
    last_seen: v.optional(partialDateSchema),
    user_id: v.optional(v.id("users")),
    gender: v.optional(v.string()),
    notes: v.optional(v.string()),
    type: v.union(v.literal("animal"), v.literal("human"), v.literal("other")),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx, true);

    const personId = await ctx.db.insert("persons", {
      ...args,
      creator_id: userId,
    });

    return personId;
  },
});

// Mutation pour mettre à jour une personne
export const update = mutation({
  args: {
    _id: v.id("persons"),
    first_name: v.optional(v.string()),
    last_name: v.optional(v.string()),
    birth_date: v.optional(partialDateSchema),
    death_date: v.optional(partialDateSchema),
    first_seen: v.optional(partialDateSchema),
    last_seen: v.optional(partialDateSchema),
    user_id: v.optional(v.id("users")),
    gender: v.optional(v.string()),
    notes: v.optional(v.string()),
    type: v.optional(
      v.union(v.literal("animal"), v.literal("human"), v.literal("other"))
    ),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx, true);

    const { _id, ...updateData } = args;

    const person = await ctx.db.get(_id);

    if (!person) {
      throw new ConvexError("Personne non trouvée");
    }

    // Vérifier que l'utilisateur est bien le créateur
    if (person.creator_id !== userId) {
      throw new ConvexError("Accès non autorisé");
    }

    // Filtrer les valeurs undefined
    const filteredData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );

    await ctx.db.patch(_id, filteredData);

    return _id;
  },
});

// Mutation pour supprimer une personne
export const suppress = mutation({
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

    await ctx.db.delete(args._id);

    return { success: true };
  },
});
