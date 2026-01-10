import type { Id } from "@/../convex/_generated/dataModel";
import type { MediaData } from "./shared.types";

export interface UserType {
  _id: Id<"users">;
  _creationTime: number;
  firstname?: string;
  lastname?: string;
  email?: string;
  gender?: string;
  medias?: MediaData[];
  friends?: Array<Id<"users">>;
  // Auth fields
  name?: string;
  image?: string;
  emailVerificationTime?: number;
  phone?: string;
  phoneVerificationTime?: number;
  isAnonymous?: boolean;
}
