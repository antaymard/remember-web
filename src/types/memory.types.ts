import type { FlexibleDateTime, MediaData } from "./shared.types";
import type { Doc, Id } from "@/../convex/_generated/dataModel";

type status = "unfinished" | "completed" | "archived";

// Type de base avec creator_id comme ID
export interface MomentType {
  _id?: Id<"moments">;
  creator_id?: Id<"users">;
  title: string;
  description?: string;
  is_secret?: boolean;
  medias?: MediaData[];
  date_time_in?: FlexibleDateTime;
  present_persons?: Id<"persons">[];
  shared_with_users?: Id<"users">[];
  status: status;
}

// Type avec creator_id populé
export interface MomentWithCreator extends Omit<MomentType, "present_persons"> {
  creator?: Doc<"users">;
  present_persons?: PersonType[];
}

export interface PersonType {
  _id?: Id<"persons">;
  creator_id?: Id<"users">;
  firstname: string;
  lastname: string;
  birth_date?: FlexibleDateTime;
  death_date?: FlexibleDateTime;
  first_met?: FlexibleDateTime;
  last_seen?: FlexibleDateTime;
  linked_user_id?: string;
  gender?: string;
  description?: string;
  type: "animal" | "human";
  relation_type?: string;
  relation_name?: string;
  medias?: MediaData[];
  shared_with_users?: Id<"users">[];
  status: status;
}

export interface PersonWithCreator extends PersonType {
  creator?: Doc<"users">;
}

export interface PlaceType {
  _id?: Id<"places">;
  title: string;
  description?: string;
  medias?: MediaData[];
  shared_with_users?: Id<"users">[];
  status: status;
  creator_id?: Id<"users">;
}

export interface PlaceWithCreator extends PlaceType {
  creator?: Doc<"users">;
}

export const thingTypes = [
  "physical",
  "music",
  "film",
  "book",
  "game",
  "interest",
  "personality",
] as const;

export type ThingTypeValue = (typeof thingTypes)[number];

export interface ThingType {
  title: string;
  creator_id?: Id<"users">;
  description?: string;
  medias?: MediaData[];
  type: ThingTypeValue;
  first_met?: FlexibleDateTime;
  last_seen?: FlexibleDateTime;
  shared_with_users?: Id<"users">[];
  status: status;
}
