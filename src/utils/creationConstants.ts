import * as z from "zod";

// Status enum partagé
export const statusEnum = z.enum(["unfinished", "completed", "archived"]);

// Type pour le statut
export type Status = z.infer<typeof statusEnum>;

// FlexibleDateTime par défaut
export const defaultFlexibleDateTime = {
  year: undefined,
  month: undefined,
  day: undefined,
  hour: undefined,
  min: undefined,
} as const;

// FlexibleDate par défaut (utilisé pour les champs sans heure)
export const defaultFlexibleDate = {
  year: 0,
  month: 0,
  day: 0,
  hour: 0,
  min: 0,
} as const;
