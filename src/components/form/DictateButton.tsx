import { useRef } from "react";
import { cn } from "@/lib/utils";
import { useVoiceDictation } from "@/hooks/useVoiceDictation";
import { TbMicrophone, TbLoader2, TbAlertCircle } from "react-icons/tb";

export default function DictateButton({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  // Snapshot of the field's value when dictation starts, so each transcript
  // update can be composed on top of it without re-reading stale closures.
  const baseRef = useRef("");

  const { isAvailable, status, error, toggle, prewarm } = useVoiceDictation((sessionText) => {
    const base = baseRef.current;
    onChange(base ? `${base} ${sessionText}` : sessionText);
  });

  if (!isAvailable) return null;

  const handleClick = (): void => {
    if (status === "idle" || status === "error") {
      baseRef.current = value;
    }
    toggle();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={prewarm}
      onFocus={prewarm}
      title={error ?? undefined}
      aria-label={status === "listening" ? "Arrêter la dictée" : "Dicter"}
      className={cn(
        "flex items-center justify-center rounded-full size-8 transition-colors",
        status === "listening"
          ? "bg-red-500 text-white animate-pulse"
          : status === "error"
            ? "text-red-500 hover:bg-grey/10"
            : "text-grey hover:bg-grey/10 hover:text-text",
        className,
      )}
    >
      {status === "connecting" || status === "stopping" ? (
        <TbLoader2 size={18} className="animate-spin" />
      ) : status === "error" ? (
        <TbAlertCircle size={18} />
      ) : (
        <TbMicrophone size={18} />
      )}
    </button>
  );
}
