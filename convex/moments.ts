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
      .filter((q) =>
        q.and(
          q.eq(q.field("creator_id"), userId),
          q.eq(q.field("status"), "completed")
        )
      )
      .order("desc")
      .collect();

    // Récupérer tous les IDs uniques de personnes et de créateurs
    const allPersonIds = new Set<string>();
    const allCreatorIds = new Set<string>();

    moments.forEach((moment) => {
      allCreatorIds.add(moment.creator_id);
      if (moment.present_persons) {
        moment.present_persons.forEach((personId) =>
          allPersonIds.add(personId)
        );
      }
    });

    // Charger toutes les personnes et créateurs en une seule fois
    const [personsMap, creatorsMap] = await Promise.all([
      Promise.all(
        Array.from(allPersonIds).map(async (id) => {
          const person = await ctx.db.get(id as any);
          return [id, person] as const;
        })
      ).then((pairs) => new Map(pairs)),
      Promise.all(
        Array.from(allCreatorIds).map(async (id) => {
          const creator = await ctx.db.get(id as any);
          return [id, creator] as const;
        })
      ).then((pairs) => new Map(pairs)),
    ]);

    // Mapper les données sur les moments
    const momentsWithPersons = moments.map((moment) => ({
      ...moment,
      creator: creatorsMap.get(moment.creator_id),
      present_persons: moment.present_persons
        ?.map((personId) => personsMap.get(personId))
        .filter((p) => p !== null && p !== undefined),
    }));

    return momentsWithPersons;
  },
});

export const read = query({
  args: {
    _id: v.id("moments"),
  },
  handler: async (ctx, { _id }) => {
    const userId = await requireAuth(ctx, true);

    const moment = await ctx.db.get("moments", _id);

    if (!moment) {
      throw new ConvexError("Moment non trouvé");
    }
    if (moment.creator_id !== userId) {
      throw new ConvexError("Accès non autorisé");
    }

    return moment;
  },
});

export const edit = mutation({
  args: {
    _id: v.optional(v.id("moments")),
    title: v.string(),
    description: v.optional(v.string()),
    is_secret: v.optional(v.boolean()),
    medias: v.optional(v.any()),
    date_time_in: v.optional(flexibleDateTime),
    present_persons: v.optional(v.array(v.id("persons"))),
    status: v.union(
      v.literal("unfinished"),
      v.literal("completed"),
      v.literal("archived")
    ),
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
