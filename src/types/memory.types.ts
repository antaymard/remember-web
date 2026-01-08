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
  status: status;
}

export interface PlaceType {
  title: string;
  description?: string;
  medias?: MediaData[];
  status: status;
  creator_id?: Id<"users">;
}

export interface ThingType {
  title: string;
  creator_id?: Id<"users">;
  description?: string;
  medias?: MediaData[];
  type: "physical" | "music" | "film" | "book";
  first_met?: FlexibleDateTime;
  last_seen?: FlexibleDateTime;
  status: status;
}
