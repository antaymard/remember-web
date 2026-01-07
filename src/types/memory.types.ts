import type { FlexibleDateTime, MediaData } from "./shared.types";
import type { Id } from "@/../convex/_generated/dataModel";

type status = "unfinished" | "completed" | "archived";

export interface MomentType {
  _id?: Id<"moments">;
  creator_id?: string;
  title: string;
  description?: string;
  is_secret?: boolean;
  medias?: MediaData[];
  date_time_in?: FlexibleDateTime;
  present_persons?: string[] | object[];
  status: status;
}

export interface PersonType {
  _id?: Id<"persons">;
  creator_id?: string;
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
}

export interface ThingType {
  title: string;
  description?: string;
  medias?: MediaData[];
  type: "physical" | "music" | "film" | "book";
  first_met?: FlexibleDateTime;
  last_seen?: FlexibleDateTime;
  status: status;
}
