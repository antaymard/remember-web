import { useMemo, useCallback } from "react";
import { Calendar } from "@/components/shadcn/calendar";

export function DayPicker({
  selected,
  onSelect,
  allowFuture,
}: {
  selected: { day: number; month: number; year: number };
  onSelect: (date: { day: number; month: number; year: number }) => void;
  allowFuture?: boolean;
}) {
  // Convertir l'objet en Date pour le Calendar
  const selectedDate = useMemo(
    () =>
      selected.day > 0 && selected.month > 0 && selected.year > 0
        ? new Date(selected.year, selected.month - 1, selected.day)
        : undefined,
    [selected.day, selected.month, selected.year]
  );

  // Gérer la sélection du Calendar
  const handleSelect = useCallback(
    (date: Date | undefined) => {
      if (date) {
        onSelect({
          day: date.getDate(),
          month: date.getMonth() + 1,
          year: date.getFullYear(),
        });
      }
    },
    [onSelect]
  );

  // Désactiver les dates futures si nécessaire
  const disabledDates = useMemo(
    () => (!allowFuture ? { after: new Date() } : undefined),
    [allowFuture]
  );

  return (
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={handleSelect}
      disabled={disabledDates}
      required
      className="w-full"
      captionLayout="dropdown"
    />
  );
}
