import { v } from "convex/values";
import { query } from "./_generated/server";
import { requireAuth } from "./utils/requireAuth";

export const listUnfinished = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx, true);

    // Lancer toutes les queries en parallèle avec les index
    const [moments, persons, things, places] = await Promise.all([
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

    return {
      moments,
      persons,
      things,
      places,
    };
  },
});

export const read = query({
  args: {
    type: v.string(),
    _id: v.union(
      v.id("moments"),
      v.id("persons"),
      v.id("things"),
      v.id("places")
    ),
  },
  handler: async (ctx, { type, _id }) => {
    const userId = await requireAuth(ctx, true);

    const memory = await ctx.db.get(_id);

    if (!memory || memory.creator_id !== userId) {
      throw new Error("Memory not found or access denied");
    }

    // Populate creator
    const creator = await ctx.db.get(memory.creator_id);

    // Populate present_persons if they exist (only for moments)
    let presentPersons = undefined;
    if ("present_persons" in memory && memory.present_persons) {
      presentPersons = await Promise.all(
        memory.present_persons.map((personId) => ctx.db.get(personId))
      );
    }

    return {
      type,
      memory: {
        ...memory,
        creator,
        present_persons: presentPersons,
      },
    };
  },
});
