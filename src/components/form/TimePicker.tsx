import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { TbClock } from "react-icons/tb";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/shadcn/dialog";
import { ButtonPastel } from "@/components/ui/Button";

interface TimePickerProps {
  form: any;
  name: string;
  placeholder?: string;
}

type Mode = "hour" | "minute";

export default function TimePicker({
  form,
  name,
  placeholder = "S�lectionner l'heure",
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("hour");
  const [tempHour, setTempHour] = useState<number | null>(null);
  const [tempMinute, setTempMinute] = useState<number | null>(null);
  const clockRef = useRef<HTMLDivElement>(null);

  return (
    <form.Field name={`${name}.hour`}>
      {(hourField: any) => (
        <form.Field name={`${name}.min`}>
          {(minuteField: any) => {
            const hour = hourField.state.value;
            const minute = minuteField.state.value;

            // Initialize temp values when opening
            useEffect(() => {
              if (isOpen) {
                setTempHour(hour ?? 12);
                setTempMinute(minute ?? 0);
                setMode("hour");
              }
            }, [isOpen]);

            const handleClockClick = (e: React.MouseEvent<HTMLDivElement>) => {
              if (!clockRef.current) return;

              const rect = clockRef.current.getBoundingClientRect();
              const centerX = rect.width / 2;
              const centerY = rect.height / 2;
              const x = e.clientX - rect.left - centerX;
              const y = e.clientY - rect.top - centerY;

              const angle = Math.atan2(y, x);
              const degrees = (angle * 180) / Math.PI + 90;
              const normalizedDegrees = degrees < 0 ? degrees + 360 : degrees;

              if (mode === "hour") {
                // Calculate distance from center to determine inner/outer ring
                const distance = Math.sqrt(x * x + y * y);
                const maxDistance = Math.min(centerX, centerY) - 20;
                const innerRingDistance = maxDistance * 0.6;

                const segment = 30; // 360 / 12
                let selectedHour = Math.round(normalizedDegrees / segment) % 12;
                if (selectedHour === 0) selectedHour = 12;

                // Outer ring: 1-12, Inner ring: 13-24 (or 0)
                if (distance < innerRingDistance) {
                  // Inner ring (13-24)
                  selectedHour = selectedHour === 12 ? 0 : selectedHour + 12;
                }

                setTempHour(selectedHour);
                // Auto-switch to minute mode after selecting hour
                setTimeout(() => setMode("minute"), 200);
              } else {
                // Minutes: 0-59, every 5 minutes has a visual marker
                const segment = 6; // 360 / 60
                const selectedMinute = Math.round(normalizedDegrees / segment) % 60;
                setTempMinute(selectedMinute);
              }
            };

            const handleOk = () => {
              hourField.handleChange(tempHour);
              minuteField.handleChange(tempMinute);
              setIsOpen(false);
            };

            const handleCancel = () => {
              setIsOpen(false);
            };

            const displayValue =
              hour !== undefined && minute !== undefined
                ? `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
                : "";

            return (
              <>
                {/* Input Trigger */}
                <div
                  className={cn(
                    "relative w-full cursor-pointer",
                    !displayValue ? "text-grey" : "text-text font-medium"
                  )}
                  onClick={() => setIsOpen(true)}
                >
                  <TbClock
                    size={24}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  />
                  <div className="h-12.5 px-4 pl-12 rounded bg-bg w-full flex items-center">
                    {displayValue || placeholder}
                  </div>
                </div>

                {/* Modal */}
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogContent
                    className="max-w-[340px] p-0"
                    onPointerDownOutside={handleCancel}
                  >
                    {/* Header */}
                    <div className="p-6 pb-4">
                      <div className="flex items-center justify-center gap-2 text-5xl font-light">
                        <button
                          type="button"
                          onClick={() => setMode("hour")}
                          className={cn(
                            "transition-colors",
                            mode === "hour"
                              ? "text-text"
                              : "text-grey/50"
                          )}
                        >
                          {String(tempHour ?? 0).padStart(2, "0")}
                        </button>
                        <span className="text-grey">:</span>
                        <button
                          type="button"
                          onClick={() => setMode("minute")}
                          className={cn(
                            "transition-colors",
                            mode === "minute"
                              ? "text-text"
                              : "text-grey/50"
                          )}
                        >
                          {String(tempMinute ?? 0).padStart(2, "0")}
                        </button>
                      </div>
                    </div>

                    {/* Clock */}
                    <div className="px-6 pb-4">
                      <div
                        ref={clockRef}
                        className="relative aspect-square w-full bg-blue/5 rounded-full cursor-pointer select-none"
                        onClick={handleClockClick}
                      >
                        <Clock
                          mode={mode}
                          selectedValue={
                            mode === "hour" ? tempHour : tempMinute
                          }
                        />
                      </div>
                    </div>

                    {/* Footer */}
                    <DialogFooter className="p-4 gap-2 flex-row justify-end border-t">
                      <ButtonPastel
                        color="red"
                        icon="x"
                        label="Fermer"
                        onClick={handleCancel}
                      />
                      <ButtonPastel
                        color="green"
                        icon="check"
                        label="OK"
                        onClick={handleOk}
                      />
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            );
          }}
        </form.Field>
      )}
    </form.Field>
  );
}

// Clock Component
interface ClockProps {
  mode: Mode;
  selectedValue: number | null;
}

function Clock({ mode, selectedValue }: ClockProps) {
  const getAngle = (value: number) => {
    if (mode === "hour") {
      const adjustedValue = value % 12 || 12;
      return ((adjustedValue - 3) * 30 * Math.PI) / 180;
    } else {
      return ((value - 15) * 6 * Math.PI) / 180;
    }
  };

  const getSelectedAngle = () => {
    if (selectedValue === null) return null;
    return getAngle(selectedValue);
  };

  const selectedAngle = getSelectedAngle();

  return (
    <div className="absolute inset-0 rounded-full flex items-center justify-center">
      {/* Center dot */}
      <div className="absolute w-2 h-2 bg-blue rounded-full z-10" />

      {/* Selected hand */}
      {selectedAngle !== null && (
        <>
          {/* Line */}
          <div
            className="absolute w-0.5 bg-blue origin-bottom z-10"
            style={{
              height: mode === "hour" && selectedValue !== null && selectedValue > 12
                ? "30%"
                : "40%",
              transform: `rotate(${(selectedAngle * 180) / Math.PI}deg) translateY(-50%)`,
            }}
          />
          {/* End dot */}
          <div
            className="absolute w-8 h-8 bg-blue rounded-full z-10 flex items-center justify-center"
            style={{
              transform: `translate(${
                Math.cos(selectedAngle) *
                (mode === "hour" && selectedValue !== null && selectedValue > 12 ? 60 : 80)
              }px, ${
                Math.sin(selectedAngle) *
                (mode === "hour" && selectedValue !== null && selectedValue > 12 ? 60 : 80)
              }px)`,
            }}
          >
            <span className="text-white text-sm font-medium">
              {selectedValue}
            </span>
          </div>
        </>
      )}

      {/* Numbers */}
      {mode === "hour" ? (
        <>
          {/* Outer ring: 1-12 */}
          {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => {
            const angle = getAngle(num);
            const radius = 80; // Outer ring
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const isSelected = selectedValue === num;

            return (
              <div
                key={`outer-${num}`}
                className={cn(
                  "absolute w-8 h-8 flex items-center justify-center rounded-full text-sm transition-colors",
                  isSelected
                    ? "text-white font-medium"
                    : "text-text/60 hover:bg-blue/10"
                )}
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                }}
              >
                {num}
              </div>
            );
          })}
          {/* Inner ring: 13-24 (0) */}
          {Array.from({ length: 12 }, (_, i) => (i === 0 ? 0 : i + 12)).map(
            (num) => {
              const displayNum = num === 0 ? 0 : num;
              const angle = getAngle(displayNum);
              const radius = 50; // Inner ring
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              const isSelected = selectedValue === displayNum;

              return (
                <div
                  key={`inner-${displayNum}`}
                  className={cn(
                    "absolute w-8 h-8 flex items-center justify-center rounded-full text-sm transition-colors",
                    isSelected
                      ? "text-white font-medium"
                      : "text-text/60 hover:bg-blue/10"
                  )}
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                >
                  {displayNum}
                </div>
              );
            }
          )}
        </>
      ) : (
        /* Minutes: show 0, 5, 10, 15, etc. */
        Array.from({ length: 12 }, (_, i) => i * 5).map((num) => {
          const angle = getAngle(num);
          const radius = 80;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const isSelected = selectedValue === num;

          return (
            <div
              key={num}
              className={cn(
                "absolute w-8 h-8 flex items-center justify-center rounded-full text-sm transition-colors",
                isSelected
                  ? "text-white font-medium"
                  : "text-text/60 hover:bg-blue/10"
              )}
              style={{
                transform: `translate(${x}px, ${y}px)`,
              }}
            >
              {String(num).padStart(2, "0")}
            </div>
          );
        })
      )}
    </div>
  );
}
