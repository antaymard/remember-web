import { cn } from "@/lib/utils";
import { TbTextCaption } from "react-icons/tb";

export default function TextArea({
  form,
  name,
  placeholder = "",
}: {
  form: any;
  name: string;
  placeholder?: string;
}) {
  return (
    <form.Field name={name}>
      {(field: {
        state: { value: any };
        handleChange: (value: any) => void;
        handleBlur: () => void;
        name: string;
      }) => {
        return (
          <div
            className={cn(
              "relative w-full",
              field.state.value ? "text-text font-medium" : "text-grey"
            )}
          >
            {!field.state.value && (
              <TbTextCaption
                size={24}
                className={cn("absolute left-4 top-4 ")}
              />
            )}
            <textarea
              className={cn(
                "p-4 rounded bg-bg placeholder:text-grey w-full transition-[color,box-shadow] focus:ring-2 ring-text outline-0 field-sizing-content min-h-32",
                !field.state.value ? "pl-12" : ""
              )}
              placeholder={placeholder}
              id={field.name}
              name={field.name}
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
