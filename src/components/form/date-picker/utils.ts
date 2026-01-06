import { cn } from "@/lib/utils";

// Styles communs pour les éléments de la grille
export const gridItemClassName = (isSelected: boolean) =>
  cn(
    "h-12 rounded-lg font-medium transition-colors",
    isSelected ? "bg-text text-bg" : "bg-grey/10 text-grey hover:bg-grey/20"
  );

export const navigationButtonClassName = (disabled: boolean = false) =>
  cn(
    "p-2 rounded-lg transition-colors",
    disabled ? "opacity-30 cursor-not-allowed" : "hover:bg-grey/10"
  );
