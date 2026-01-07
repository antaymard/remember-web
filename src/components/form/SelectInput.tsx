import { cn } from "@/lib/utils";
import type { IconType } from "react-icons";
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/shadcn/select";

export default function SelectInput({
    form,
    name,
    icon,
    placeholder,
    label,
    options = []
}: {
    form: any;
    name: string;
    icon?: IconType;
    placeholder?: string;
    options: { value: string; label: string }[];
    label?: string;
}) {
    const Icon = icon;
    return <form.Field name={name}>{
        field => {
            return <>
                <Select onValueChange={e => field.handleChange(e)} value={field.state.value}>
                    <SelectTrigger className={cn("bg-bg border-0 !h-12.5 px-4 rounded placeholder:text-grey  text-text w-full", field.state.value ? "font-medium" : "")} >
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent className="text-base">
                        {label && <SelectLabel>{label}</SelectLabel>}
                        {options.map(option => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </>
        }}
    </form.Field>
}
