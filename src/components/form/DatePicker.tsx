import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcn/dialog";
import { cn } from "@/lib/utils";
import { TbCalendarPlus } from "react-icons/tb";
import { ButtonPastel } from "../ui/Button";
import { DayPicker } from "./date-picker/DayPicker";
import { MonthPicker } from "./date-picker/MonthPicker";
import { YearPicker } from "./date-picker/YearPicker";
import { ModePicker, type Mode } from "./date-picker/ModePicker";

const MONTHS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

function formatDateValue(
  value: { day?: number; month?: number; year?: number } | undefined
): string | null {
  if (!value) return null;

  const { day, month, year } = value;

  // Jour + Mois + Année
  if (day && month && year) {
    return `${day} ${MONTHS[month - 1]} ${year}`;
  }

  // Mois + Année
  if (month && year) {
    return `${MONTHS[month - 1]} ${year}`;
  }

  // Année seule
  if (year) {
    return `${year}`;
  }

  return null;
}

export default function DatePicker({
  form,
  name,
  placeholder = "Sélectionner la date",
  allowFuture = false,
}: {
  form: any;
  name: string;
  placeholder?: string;
  allowFuture?: boolean;
}) {
  const [mode, setMode] = useState<Mode>("day");
  const [open, setOpen] = useState(false);
  const [tempValue, setTempValue] = useState<{
    day: number;
    month: number;
    year: number;
  }>({
    day: 0,
    month: 0,
    year: 0,
  });

  return (
    <form.Field name={name}>
      {(field) => {
        const handleOpenChange = (newOpen: boolean) => {
          if (newOpen) {
            // Quand on ouvre, initialiser avec la valeur du form
            // setTempValue({
            //   hour: field.state?.value?.hour || 0,
            //   min: field.state?.value?.min || 0,
            // });
          }
          setOpen(newOpen);
        };
        const handleClear = () => {
          field.handleChange({
            ...field.state.value,
            day: undefined,
            month: undefined,
            year: undefined,
          });
          setOpen(false);
        };
        const handleConfirm = () => {
          const updates: any = { ...field.state.value };

          if (mode === "year" && tempValue.year > 0) {
            updates.year = tempValue.year;
            updates.month = undefined;
            updates.day = undefined;
          } else if (
            mode === "month" &&
            tempValue.month > 0 &&
            tempValue.year > 0
          ) {
            updates.month = tempValue.month;
            updates.year = tempValue.year;
            updates.day = undefined;
          } else if (
            mode === "day" &&
            tempValue.day > 0 &&
            tempValue.month > 0 &&
            tempValue.year > 0
          ) {
            updates.day = tempValue.day;
            updates.month = tempValue.month;
            updates.year = tempValue.year;
          }

          field.handleChange(updates);
          setOpen(false);
        };
        return (
          <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <button
                type="button"
                className={cn(
                  "h-12.5 px-4 rounded bg-bg placeholder:text-grey w-full focus:ring-2 transition-[color,box-shadow] ring-text outline-0 flex items-center justify-start gap-2",
                  formatDateValue(field.state?.value)
                    ? "text-text"
                    : "text-grey"
                )}
              >
                <TbCalendarPlus size={24} />
                {formatDateValue(field.state?.value) || placeholder}
              </button>
            </DialogTrigger>
            <DialogContent showCloseButton={false} aria-describedby={undefined}>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between text-base font-medium text-left">
                  Sélectionner la date
                  <ModePicker mode={mode} setMode={setMode} />
                </DialogTitle>
              </DialogHeader>
              {mode === "year" && (
                <YearPicker
                  selectedYear={tempValue.year}
                  onYearSelect={(year) => setTempValue({ ...tempValue, year })}
                  allowFuture={allowFuture}
                />
              )}
              {mode === "month" && (
                <MonthPicker
                  selectedMonth={tempValue.month}
                  selectedYear={tempValue.year}
                  onMonthSelect={(month) =>
                    setTempValue({ ...tempValue, month })
                  }
                  onYearSelect={(year) => setTempValue({ ...tempValue, year })}
                  allowFuture={allowFuture}
                />
              )}
              {mode === "day" && (
                <DayPicker
                  selected={tempValue}
                  onSelect={(date) => {
                    setTempValue(date);
                  }}
                  allowFuture={allowFuture}
                />
              )}
              <DialogFooter>
                <div className="flex items-center justify-between">
                  <ButtonPastel
                    label="Effacer"
                    color="red"
                    icon="trash"
                    onClick={handleClear}
                  />
                  <ButtonPastel
                    label="OK"
                    color="green"
                    icon="check"
                    onClick={handleConfirm}
                  />
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        );
      }}
    </form.Field>
  );
}
