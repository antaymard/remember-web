import { cn } from "@/lib/utils";
import { TbTextColor, TbTextRecognition } from "react-icons/tb";

const Icons = {
  title: TbTextRecognition,
  text: TbTextColor,
};

export default function TextInput({
  form,
  name,
  type,
  placeholder = "",
  icon = "title",
}: {
  form: any;
  name: string;
  type?: string;
  placeholder?: string;
  icon?: "title" | "text";
}) {
  return (
    <form.Field name={name}>
      {(field) => {
        const Icon = Icons[icon];
        return (
          <div
            className={cn(
              "relative w-full",
              field.state.value ? "text-text font-medium" : "text-grey"
            )}
          >
            <Icon
              size={24}
              className={cn(
                "absolute left-4 top-1/2 transform -translate-y-1/2"
              )}
            />
            <input
              className="h-12.5 px-4 pl-12 rounded bg-bg placeholder:text-grey w-full focus:ring-2 transition-[color,box-shadow] ring-text outline-0  "
              placeholder={placeholder}
              id={field.name}
              name={field.name}
              type={type}
              onBlur={field.handleBlur}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </div>
        );
      }}
    </form.Field>
  );
}
