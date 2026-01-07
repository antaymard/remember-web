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
