import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./utils/requireAuth";
import type { Id } from "./_generated/dataModel";

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
    type: v.union(
      v.literal("moment"),
      v.literal("person"),
      v.literal("thing"),
      v.literal("place")
    ),
    _id: v.union(
      v.id("moments"),
      v.id("persons"),
      v.id("things"),
      v.id("places")
    ),
    populate: v.optional(v.string()),
  },
  handler: async (ctx, { type, _id, populate }) => {
    const userId = await requireAuth(ctx, true);

    const table = {
      moment: "moments",
      person: "persons",
      thing: "things",
      place: "places",
    } as const;

    const memory = await ctx.db.get(table[type], _id);

    if (!memory) {
      throw new ConvexError("Souvenir non trouvé.");
    }

    // Vérifier si l'utilisateur est le créateur OU si le souvenir est partagé avec lui
    const isCreator = memory.creator_id === userId;
    const isSharedWith =
      "shared_with_users" in memory &&
      memory.shared_with_users &&
      Array.isArray(memory.shared_with_users) &&
      memory.shared_with_users.some((id: Id<"users">) => id === userId);

    if (!isCreator && !isSharedWith) {
      throw new ConvexError("Accès non autorisé au souvenir.");
    }

    const populatedFields: Record<string, any> = {};

    if (populate) {
      const fieldsToPopulate = populate.split(" ");

      if (fieldsToPopulate.includes("creator")) {
        populatedFields.creator = await ctx.db.get(memory.creator_id);
      }

      if (
        fieldsToPopulate.includes("present_persons") &&
        "present_persons" in memory &&
        memory.present_persons
      ) {
        populatedFields.present_persons = await Promise.all(
          memory.present_persons.map((personId) => ctx.db.get(personId))
        );
      }
    }

    return {
      type,
      memory: {
        ...memory,
        ...populatedFields,
      },
    };
  },
});

export const trash = mutation({
  args: {
    type: v.union(
      v.literal("moment"),
      v.literal("person"),
      v.literal("thing"),
      v.literal("place")
    ),
    _id: v.union(
      v.id("moments"),
      v.id("persons"),
      v.id("things"),
      v.id("places")
    ),
  },
  handler: async (ctx, { type, _id }) => {
    const userId = await requireAuth(ctx, true);

    const typeMap = {
      moment: "moments",
      person: "persons",
      thing: "things",
      place: "places",
    } as const;

    const memory = await ctx.db.get(typeMap[type], _id);

    if (!memory) {
      throw new ConvexError("Memory non trouvée");
    }
    if (memory.creator_id !== userId) {
      throw new ConvexError("Accès non autorisé");
    }
    await ctx.db.delete(_id);
    return true;
  },
});

export const list = query({
  args: {
    type: v.array(
      v.union(
        v.literal("moment"),
        v.literal("person"),
        v.literal("thing"),
        v.literal("place")
      )
    ),
    populate: v.optional(v.string()),
    list_only_mine: v.optional(v.boolean()),
    filter: v.optional(
      v.object({
        status: v.optional(
          v.union(
            v.literal("unfinished"),
            v.literal("completed"),
            v.literal("archived")
          )
        ),
      })
    ),
  },
  handler: async (ctx, { type, populate, list_only_mine, filter }) => {
    const userId = await requireAuth(ctx, true);

    // Mapping des types vers les noms de tables
    const tableMap = {
      moment: "moments",
      person: "persons",
      thing: "things",
      place: "places",
    } as const;

    // Lancer les queries en parallèle uniquement pour les types demandés
    const queryPromises = type.map(async (memoryType) => {
      const tableName = tableMap[memoryType];

      // Si un status est spécifié, utiliser l'index by_creator_and_status pour meilleures perfs
      let results;
      if (filter?.status) {
        results = await ctx.db
          .query(tableName)
          .withIndex("by_creator_and_status", (q) =>
            q.eq("creator_id", userId).eq("status", filter.status!)
          )
          .collect();
      } else {
        // Sinon, utiliser l'index by_creator simple
        results = await ctx.db
          .query(tableName)
          .withIndex("by_creator", (q) => q.eq("creator_id", userId))
          .collect();
      }

      // Si list_only_mine est false, ajouter les souvenirs partagés avec l'utilisateur
      if (list_only_mine === false) {
        let sharedResults;
        if (filter?.status) {
          sharedResults = await ctx.db
            .query(tableName)
            .filter((q) =>
              q.and(
                q.neq(q.field("creator_id"), userId),
                q.eq(q.field("status"), filter.status!)
              )
            )
            .collect();
        } else {
          sharedResults = await ctx.db
            .query(tableName)
            .filter((q) => q.neq(q.field("creator_id"), userId))
            .collect();
        }

        // Filtrer seulement ceux qui sont partagés avec l'utilisateur
        const sharedWithMe = sharedResults.filter((item) => {
          const sharedWith =
            "shared_with_users" in item ? item.shared_with_users : undefined;
          if (!sharedWith || !Array.isArray(sharedWith)) return false;
          return sharedWith.some((id: Id<"users">) => id === userId);
        });

        // Combiner les résultats
        results = [...results, ...sharedWithMe];
      }

      // Ajouter la propriété _memory_type à chaque résultat
      return results.map((item) => ({
        ...item,
        _memory_type: memoryType,
      }));
    });

    // Attendre toutes les queries
    const allResults = await Promise.all(queryPromises);

    // Fusionner tous les tableaux en un seul
    const mergedResults = allResults.flat();

    // Trier par _creationTime décroissant (plus récent en premier)
    mergedResults.sort((a, b) => b._creationTime - a._creationTime);

    // Si pas de populate, retourner les résultats directement
    if (!populate) {
      return mergedResults;
    }

    // Parse les champs à populer
    const fieldsToPopulate = populate.split(" ");

    // Collecter tous les IDs uniques
    const allCreatorIds = new Set<string>();
    const allPersonIds = new Set<string>();

    mergedResults.forEach((memory) => {
      allCreatorIds.add(memory.creator_id);

      // Collecter les present_persons uniquement pour les moments
      if (
        "present_persons" in memory &&
        memory.present_persons &&
        Array.isArray(memory.present_persons)
      ) {
        memory.present_persons.forEach((personId) => {
          allPersonIds.add(personId);
        });
      }
    });

    // Charger tous les creators et persons en batch
    const [creatorsMap, personsMap] = await Promise.all([
      // Charger les creators (users)
      Promise.all(
        Array.from(allCreatorIds).map(async (id) => {
          const creator = await ctx.db.get(id as Id<"users">);
          return [id, creator] as const;
        })
      ).then((pairs) => new Map(pairs)),
      // Charger les persons
      Promise.all(
        Array.from(allPersonIds).map(async (id) => {
          const person = await ctx.db.get(id as Id<"persons">);
          return [id, person] as const;
        })
      ).then((pairs) => new Map(pairs)),
    ]);

    // Dispatcher les données populées
    const populatedResults = mergedResults.map((memory) => {
      return {
        ...memory,
        ...(fieldsToPopulate.includes("creator_id") && {
          creator: creatorsMap.get(memory.creator_id),
        }),
        ...(fieldsToPopulate.includes("present_persons") &&
          "present_persons" in memory &&
          memory.present_persons &&
          Array.isArray(memory.present_persons) && {
            present_persons: memory.present_persons
              .map((personId) => personsMap.get(personId))
              .filter((p) => p !== null && p !== undefined),
          }),
      };
    });

    return populatedResults;
  },
});
