import { cn } from "@/lib/utils";
import { TbX, TbCheck, TbTrash } from "react-icons/tb";

interface ButtonPastelProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color: "blue" | "green" | "red" | "grey";
  label?: string;
  icon?: React.ReactNode | "x" | "check" | "trash";
  type?: "button" | "submit" | "reset";
}

const classNames = {
  blue: "bg-blue/10 text-blue",
  green: "bg-green/10 text-green",
  red: "bg-red/10 text-red",
  grey: "bg-grey/10 text-grey",
};

function renderIcon(icon: React.ReactNode | "x" | "check") {
  const iconSize = 18;
  switch (icon) {
    case "x":
      return <TbX size={iconSize} className="path-stroke-2" />;
    case "check":
      return <TbCheck size={iconSize} className="path-stroke-2" />;
    case "trash":
      return <TbTrash size={iconSize} className="path-stroke-2" />;
    default:
      return icon;
  }
}

export function ButtonPastel({
  color = "blue",
  label,
  icon,
  type = "button",
  ...props
}: ButtonPastelProps) {
  return (
    <button
      type={type}
      className={cn(
        "flex items-center gap-2 rounded-full h-10 font-medium",
        classNames[color],
        !label ? "w-10 justify-center" : "px-4"
      )}
      {...props}
    >
      {icon && renderIcon(icon)}
      {label}
    </button>
  );
}
