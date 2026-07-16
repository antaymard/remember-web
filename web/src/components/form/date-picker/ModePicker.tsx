import { useCallback, useMemo } from "react";
import { TbCalendarQuestion } from "react-icons/tb";

export type Mode = "day" | "month" | "year";

function renderModeText(mode: Mode) {
  switch (mode) {
    case "day":
      return "J/M/A";
    case "month":
      return "M/A";
    case "year":
      return "A";
  }
}

export function ModePicker({
  mode,
  setMode,
}: {
  mode: Mode;
  setMode: (mode: Mode) => void;
}) {
  const modeText = useMemo(() => renderModeText(mode), [mode]);

  const shuffleMode = useCallback(() => {
    switch (mode) {
      case "day":
        setMode("month");
        break;
      case "month":
        setMode("year");
        break;
      case "year":
        setMode("day");
        break;
    }
  }, [mode, setMode]);

  return (
    <button
      type="button"
      className="flex items-center gap-2 rounded-full h-10 font-medium bg-grey/10 text-grey px-4"
      onClick={shuffleMode}
    >
      <TbCalendarQuestion size={18} className="path-stroke-2" />
      {modeText}
    </button>
  );
}
