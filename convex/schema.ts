import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  // Your other tables...
  persons: defineTable({
    first_name: v.string(),
    last_name: v.string(),
    birth_date: v.optional(
      v.object({
        year: v.number(),
        month: v.optional(v.number()),
        day: v.optional(v.number()),
      })
    ),
    death_date: v.optional(
      v.object({
        year: v.number(),
        month: v.optional(v.number()),
        day: v.optional(v.number()),
      })
    ),
    first_seen: v.optional(
      v.object({
        year: v.number(),
        month: v.optional(v.number()),
        day: v.optional(v.number()),
      })
    ),
    last_seen: v.optional(
      v.object({
        year: v.number(),
        month: v.optional(v.number()),
        day: v.optional(v.number()),
      })
    ),
    user_id: v.optional(v.id("users")), // Link to the user who this person represents, if any
    creator_id: v.id("users"), // Link to the user who created this person entry
    gender: v.optional(v.string()),
    notes: v.optional(v.string()),
    type: v.union(v.literal("animal"), v.literal("human"), v.literal("other")),
  }),
});

export default schema;
