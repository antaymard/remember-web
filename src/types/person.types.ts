import type { Id } from "../../convex/_generated/dataModel";

export type PersonType = "animal" | "human" | "other";

export type Person = {
  _id: Id<"persons">;
  _creationTime: number;
  first_name: string;
  last_name: string;
  birth_date?: {
    year: number;
    month?: number;
    day?: number;
  };
  death_date?: {
    year: number;
    month?: number;
    day?: number;
  };
  first_seen?: {
    year: number;
    month?: number;
    day?: number;
  };
  last_seen?: {
    year: number;
    month?: number;
    day?: number;
  };
  user_id?: Id<"users">;
  creator_id: Id<"users">;
  gender?: string;
  notes?: string;
  type: PersonType;
};

export type NewPerson = Omit<Person, "_id" | "_creationTime">;
