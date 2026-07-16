import type { FlexibleDateTime } from "@/types/shared.types";

const JOURS = [
  "dimanche",
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
];

const MOIS = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

/**
 * Formate une FlexibleDateTime en français naturel.
 * - Année seule : "2025"
 * - Mois + année : "août 2025"
 * - Date complète : "vendredi 12 août 2025"
 * - Avec heure : "vendredi 12 août 2025 à 14h30"
 */
export function formatFlexibleDate(date: FlexibleDateTime | undefined): string | null {
  if (!date) return null;

  const { year, month, day, hour, min } = date;

  if (!year) return null;

  // Année seule
  if (!month) return `${year}`;

  // Mois + année
  if (!day) return `${MOIS[month - 1]} ${year}`;

  // Date complète
  const d = new Date(year, month - 1, day);
  const jourSemaine = JOURS[d.getDay()];
  let result = `${jourSemaine} ${day} ${MOIS[month - 1]} ${year}`;

  // Avec heure
  if (hour != null && min != null) {
    const minStr = String(min).padStart(2, "0");
    result += ` à ${hour}h${minStr}`;
  }

  return result;
}
