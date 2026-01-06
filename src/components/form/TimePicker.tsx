import { useState } from "react";
import { cn } from "@/lib/utils";
import { TbClock } from "react-icons/tb";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcn/dialog";
import { ButtonPastel } from "@/components/ui/Button";

import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimeClock } from "@mui/x-date-pickers/TimeClock";

interface TimePickerProps {
  form: any;
  name: string;
  placeholder?: string;
}

export default function TimePicker({
  form,
  name,
  placeholder = "Sélectionner l'heure",
}: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const [tempValue, setTempValue] = useState<{ hour: number; min: number }>({
    hour: 0,
    min: 0,
  });

  return (
    <form.Field name={name}>
      {(field) => {
        const handleOpenChange = (newOpen: boolean) => {
          if (newOpen) {
            // Quand on ouvre, initialiser avec la valeur du form
            setTempValue({
              hour: field.state?.value?.hour || 0,
              min: field.state?.value?.min || 0,
            });
          }
          setOpen(newOpen);
        };

        const handleConfirm = () => {
          field.handleChange({
            ...field.state.value,
            hour: tempValue.hour,
            min: tempValue.min,
          });
          setOpen(false);
        };

        const handleClear = () => {
          field.handleChange({
            ...field.state.value,
            hour: 0,
            min: 0,
          });
          setOpen(false);
        };

        return (
          <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <button
                type="button"
                className={cn(
                  "h-12.5 px-4 rounded bg-bg placeholder:text-grey w-full focus:ring-2 transition-[color,box-shadow] ring-text outline-0 text-grey flex items-center justify-start gap-2"
                )}
              >
                <TbClock size={24} />
                {field.state?.value?.hour && field.state?.value?.min
                  ? `${field.state?.value?.hour}h${field.state?.value?.min}`
                  : placeholder}
              </button>
            </DialogTrigger>
            <DialogContent showCloseButton={false} aria-describedby={undefined}>
              <DialogHeader>
                <DialogTitle className="text-base font-medium text-left">
                  Sélectionner l'heure
                </DialogTitle>
              </DialogHeader>
              <div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimeClock
                    ampm={false}
                    value={dayjs().hour(tempValue.hour).minute(tempValue.min)}
                    onChange={(newValue) =>
                      setTempValue({
                        hour: newValue?.hour() || 0,
                        min: newValue?.minute() || 0,
                      })
                    }
                  />
                </LocalizationProvider>
              </div>
              <DialogFooter>
                <div className="flex items-center justify-between">
                  <ButtonPastel
                    color="red"
                    icon="trash"
                    label="Effacer"
                    onClick={handleClear}
                  />
                  <ButtonPastel
                    color="green"
                    icon="check"
                    label="OK"
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
