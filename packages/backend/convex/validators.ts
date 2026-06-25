import { v } from "convex/values";

/**
 * Validateurs réutilisables pour éviter la duplication dans les endpoints
 */

// Validateur pour le status
export const statusValidator = v.union(
  v.literal("unfinished"),
  v.literal("completed"),
  v.literal("archived"),
);

// Validateur pour les champs communs à tous les memories
export const commonMemoryFields = {
  description: v.optional(v.string()),
  medias: v.optional(v.any()),
  shared_with_users: v.optional(v.array(v.id("users"))),
  status: statusValidator,
  updated_at: v.optional(v.number()),
};

// Validateur pour les champs communs aux moments, persons et things (qui ont un titre)
export const titledMemoryFields = {
  title: v.string(),
  ...commonMemoryFields,
};
