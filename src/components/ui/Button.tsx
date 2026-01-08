import { cn } from "@/lib/utils";
import {
  TbX,
  TbCheck,
  TbTrash,
  TbPlus,
  TbAdjustments,
  TbPencil,
} from "react-icons/tb";

type icon =
  | React.ReactNode
  | "x"
  | "check"
  | "trash"
  | "plus"
  | "settings"
  | "pen";

interface ButtonPastelProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: "blue" | "green" | "red" | "grey";
  label?: string;
  icon?: icon;
  variant?: "solid" | "pastel";
}

const classNames = {
  pastel: {
    blue: "bg-blue/10 text-blue",
    green: "bg-green/10 text-green",
    red: "bg-red/10 text-red",
    grey: "bg-grey/10 text-grey",
  },
  solid: {
    blue: "bg-blue text-white hover:bg-blue/90",
    green: "bg-green text-white hover:bg-green/90",
    red: "bg-red text-white hover:bg-red/90",
    grey: "bg-grey text-white hover:bg-grey/90",
  },
};

function renderIcon(icon: icon) {
  const iconSize = 18;
  switch (icon) {
    case "x":
      return <TbX size={iconSize} className="path-stroke-2" />;
    case "check":
      return <TbCheck size={iconSize} className="path-stroke-2" />;
    case "trash":
      return <TbTrash size={iconSize} className="path-stroke-2" />;
    case "plus":
    case "add":
      return <TbPlus size={iconSize} className="path-stroke-2" />;
    case "settings":
      return <TbAdjustments size={iconSize} className="path-stroke-2" />;
    case "pen":
    case "pencil":
      return <TbPencil size={iconSize} className="path-stroke-2" />;
    default:
      return icon;
  }
}

export function ButtonPastel({
  color = "blue",
  label,
  icon,
  className,
  variant = "pastel",
  ...props
}: ButtonPastelProps) {
  return (
    <button
      className={cn(
        "flex items-center gap-2 rounded-full h-10 font-medium disabled:opacity-50 disabled:cursor-not-allowed",
        classNames[variant][color],
        !label ? "w-10 justify-center" : "px-4",
        className
      )}
      {...props}
    >
      {icon && renderIcon(icon)}
      {label}
    </button>
  );
}
