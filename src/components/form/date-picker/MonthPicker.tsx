import { useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";
import { gridItemClassName, navigationButtonClassName } from "./utils";

// Constante extraite en dehors du composant
const MONTHS = [
  { num: 1, label: "Janvier" },
  { num: 2, label: "Février" },
  { num: 3, label: "Mars" },
  { num: 4, label: "Avril" },
  { num: 5, label: "Mai" },
  { num: 6, label: "Juin" },
  { num: 7, label: "Juillet" },
  { num: 8, label: "Août" },
  { num: 9, label: "Sept." },
  { num: 10, label: "Octobre" },
  { num: 11, label: "Nov." },
  { num: 12, label: "Déc." },
] as const;

export function MonthPicker({
  selectedMonth,
  selectedYear,
  onMonthSelect,
  onYearSelect,
  allowFuture = false,
}: {
  selectedMonth: number;
  selectedYear: number;
  onMonthSelect: (month: number) => void;
  onYearSelect: (year: number) => void;
  allowFuture?: boolean;
}) {
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const currentMonth = useMemo(() => new Date().getMonth() + 1, []);
  const displayYear = selectedYear || currentYear;

  const handlePrevious = useCallback(() => {
    onYearSelect(displayYear - 1);
  }, [displayYear, onYearSelect]);

  const handleNext = useCallback(() => {
    onYearSelect(displayYear + 1);
  }, [displayYear, onYearSelect]);

  const canGoNext = useMemo(
    () => allowFuture || displayYear < currentYear,
    [allowFuture, displayYear, currentYear]
  );

  // Générer les années pour le dropdown (100 ans dans le passé jusqu'à aujourd'hui ou futur)
  const years = useMemo(() => {
    const endYear = allowFuture ? currentYear + 10 : currentYear;
    const startYear = endYear - 100;
    return Array.from(
      { length: endYear - startYear + 1 },
      (_, i) => startYear + i
    ).reverse();
  }, [allowFuture, currentYear]);

  const isMonthDisabled = useCallback(
    (month: number) => {
      if (allowFuture) return false;
      if (displayYear > currentYear) return true;
      if (displayYear === currentYear && month > currentMonth) return true;
      return false;
    },
    [allowFuture, displayYear, currentYear, currentMonth]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={handlePrevious}
          className={navigationButtonClassName()}
        >
          <TbChevronLeft size={20} />
        </button>
        <Select
          value={String(displayYear)}
          onValueChange={(value) => onYearSelect(Number(value))}
        >
          <SelectTrigger className="w-32">
            <SelectValue>{displayYear}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={String(year)}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <button
          type="button"
          onClick={handleNext}
          disabled={!canGoNext}
          className={navigationButtonClassName(!canGoNext)}
        >
          <TbChevronRight size={20} />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {MONTHS.map((month) => {
          const disabled = isMonthDisabled(month.num);
          return (
            <button
              key={month.num}
              type="button"
              onClick={() => !disabled && onMonthSelect(month.num)}
              disabled={disabled}
              className={cn(
                gridItemClassName(selectedMonth === month.num),
                disabled && "opacity-30 cursor-not-allowed hover:bg-grey/10"
              )}
            >
              {month.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
