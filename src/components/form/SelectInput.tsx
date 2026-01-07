import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";

export default function SelectInput({
  form,
  name,
  placeholder,
  label,
  options = [],
}: {
  form: any;
  name: string;
  placeholder?: string;
  options: { value: string; label: string }[];
  label?: string;
}) {
  return (
    <form.Field name={name}>
      {(field: {
        state: { value: any };
        handleChange: (value: any) => void;
        name: string;
      }) => {
        return (
          <>
            <Select
              onValueChange={(e) => field.handleChange(e)}
              value={field.state.value}
            >
              <SelectTrigger
                className={cn(
                  "bg-bg border-0 !h-12.5 px-4 rounded placeholder:text-grey  text-text w-full",
                  field.state.value ? "font-medium" : ""
                )}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent className="text-base">
                {label && <SelectLabel>{label}</SelectLabel>}
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        );
      }}
    </form.Field>
  );
}
