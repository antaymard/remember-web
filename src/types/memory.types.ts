import type { FlexibleDateTime, MediaData } from "./shared.types";
import type { Id } from "../../convex/_generated/dataModel";

export interface MomentType {
  _id?: Id<"moments">;
  creator_id?: string;
  title?: string;
  description?: string;
  is_secret?: boolean;
  medias?: MediaData[];
  date_time_in?: FlexibleDateTime;
}
