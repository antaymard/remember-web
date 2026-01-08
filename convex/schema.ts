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

export const media = v.object({
  url: v.string(),
  type: v.union(v.literal("image")),
  upload_date: v.number(),
  shot_date: v.optional(v.number()),
  gps_coordinates: v.optional(v.any()),
  orientation: v.optional(v.any()),
  camera_model: v.optional(v.any()),
  original_dimensions: v.optional(v.any()),
});

export const status = v.union(
  v.literal("unfinished"),
  v.literal("completed"),
  v.literal("archived")
);

const schema = defineSchema({
  ...authTables,
  // Your other tables...

  // Override the users table to add custom fields
  users: defineTable({
    // Existing fields from authTables
    name: v.optional(v.string()), // Not used
    image: v.optional(v.string()), // Not used
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),

    // Custom fields
    firstname: v.optional(v.string()),
    lastname: v.optional(v.string()),
    gender: v.optional(v.string()),
    medias: v.optional(v.array(media)),
  })
    .index("email", ["email"])
    .index("phone", ["phone"]),

  moments: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    is_secret: v.optional(v.boolean()),
    medias: v.optional(v.array(media)), // Assuming MediaData is stored as JSON
    date_time_in: v.optional(flexibleDateTime),
    creator_id: v.id("users"), // Link to the user who created this moment
    present_persons: v.optional(v.array(v.id("persons"))),
    status: status,
    is_shared_with_present_persons: v.optional(v.boolean()),
  })
    .index("by_creator", ["creator_id"])
    .index("by_creator_and_status", ["creator_id", "status"]),

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
    medias: v.optional(v.array(media)),
    status: status,
    is_shared_with_present_persons: v.optional(v.boolean()),
  })
    .index("by_creator", ["creator_id"])
    .index("by_creator_and_status", ["creator_id", "status"]),

  places: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    creator_id: v.id("users"), // Link to the user who created this person entry
    medias: v.optional(v.array(media)),
    status: status,
    is_shared_with_present_persons: v.optional(v.boolean()),
  })
    .index("by_creator", ["creator_id"])
    .index("by_creator_and_status", ["creator_id", "status"]),

  things: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    creator_id: v.id("users"), // Link to the user who created this person entry
    medias: v.optional(v.array(media)),
    type: v.union(
      v.literal("physical"),
      v.literal("music"),
      v.literal("film"),
      v.literal("book")
    ),
    first_met: v.optional(flexibleDateTime),
    last_seen: v.optional(flexibleDateTime),
    status: status,
    is_shared_with_present_persons: v.optional(v.boolean()),
  })
    .index("by_creator", ["creator_id"])
    .index("by_creator_and_status", ["creator_id", "status"]),
});

export default schema;
