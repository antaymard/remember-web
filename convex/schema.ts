import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export const flexibleDateTime = v.object({
  year: v.optional(v.number()),
  month: v.optional(v.number()),
  day: v.optional(v.number()),
  hour: v.optional(v.number()),
  min: v.optional(v.number()),
});

const schema = defineSchema({
  ...authTables,
  // Your other tables...

  moments: defineTable({
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    is_secret: v.optional(v.boolean()),
    medias: v.optional(v.any()), // Assuming MediaData is stored as JSON
    date_time_in: v.optional(flexibleDateTime),
    creator_id: v.id("users"), // Link to the user who created this moment
  }),

  persons: defineTable({
    firstname: v.string(),
    lastname: v.string(),
    type: v.union(v.literal("animal"), v.literal("human")),
    birth_date: v.optional(flexibleDateTime),
    death_date: v.optional(flexibleDateTime),
    first_met: v.optional(flexibleDateTime),
    last_seen: v.optional(flexibleDateTime),
    linked_user_id: v.optional(v.id("users")), // Link to the user who this person represents, if any
    creator_id: v.id("users"), // Link to the user who created this person entry
    gender: v.optional(v.string()),
    description: v.optional(v.string()),
    relation_type: v.optional(v.string()),
    relation_name: v.optional(v.string()),
    medias: v.optional(v.any()),
  }),
});

export default schema;
