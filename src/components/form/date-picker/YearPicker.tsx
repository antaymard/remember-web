import { useState, useMemo, useCallback } from "react";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";
import { gridItemClassName, navigationButtonClassName } from "./utils";

export function YearPicker({
  selectedYear,
  onYearSelect,
  allowFuture = false,
}: {
  selectedYear: number;
  onYearSelect: (year: number) => void;
  allowFuture?: boolean;
}) {
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const [startYear, setStartYear] = useState(currentYear);

  // Génère un tableau de 12 années (3 colonnes x 4 lignes)
  const years = useMemo(
    () => Array.from({ length: 12 }, (_, i) => startYear - 11 + i),
    [startYear]
  );

  const handlePrevious = useCallback(() => {
    setStartYear((prev) => prev - 12);
  }, []);

  const handleNext = useCallback(() => {
    setStartYear((prev) => prev + 12);
  }, []);

  const canGoNext = useMemo(
    () => allowFuture || startYear < currentYear,
    [allowFuture, startYear, currentYear]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrevious}
          className={navigationButtonClassName()}
        >
          <TbChevronLeft size={20} />
        </button>
        <span className="text-sm font-medium text-grey">
          {startYear - 11} - {startYear}
        </span>
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
        {years.map((year) => (
          <button
            key={year}
            type="button"
            onClick={() => onYearSelect(year)}
            className={gridItemClassName(selectedYear === year)}
          >
            {year}
          </button>
        ))}
      </div>
    </div>
  );
}
