import { cn } from "@/lib/utils";
import { Switch } from "@/components/shadcn/switch";
import type { IconType } from "react-icons";

export default function Switcher({
  form,
  name,
  label,
  icon,
}: {
  form: any;
  name: string;
  label?: string;
  icon: IconType;
}) {
  const Icon = icon;
  return (
    <form.Field name={name}>
      {(field) => {
        return (
          <div className={cn("w-full flex items-center justify-between")}>
            {(icon || label) && (
              <div className="flex items-center gap-2">
                {Icon && <Icon size={20} className="text-text" />}
                {label && (
                  <label htmlFor={field.name} className="text-text">
                    {label}
                  </label>
                )}
              </div>
            )}
            <Switch
              id={field.name}
              checked={field.state.value}
              onCheckedChange={field.handleChange}
            />

            {/* <input
              className="h-12.5 px-4 pl-12 rounded bg-bg placeholder:text-grey w-full focus:ring-2 transition-[color,box-shadow] ring-text outline-0  "
              placeholder={placeholder}
              id={field.name}
              name={field.name}
              type={type}
              onBlur={field.handleBlur}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            /> */}
          </div>
        );
      }}
    </form.Field>
  );
}
