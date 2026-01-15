import { cn } from "@/lib/utils";
import type { MemoryType } from "@/types/shared.types";
import {
  TbBuildingLighthouse,
  TbUserHexagon,
  TbWindmill,
  TbBox,
} from "react-icons/tb";

const className =
  "h-10 w-10 aspect-square rounded-full flex items-center justify-center";

export default function MemoryTypeIndicator({
  memoryType,
}: {
  memoryType: MemoryType;
}) {
  switch (memoryType) {
    case "moment":
      return (
        <div className={cn(className, "bg-purple-500/10 text-purple-500")}>
          <TbWindmill size={20} />
        </div>
      );
    case "place":
      return (
        <div className={cn(className, "bg-blue-500/10 text-blue-500")}>
          <TbBuildingLighthouse size={20} />
        </div>
      );
    case "person":
      return (
        <div className={cn(className, "bg-yellow-500/10 text-yellow-500")}>
          <TbUserHexagon size={20} />
        </div>
      );
    case "thing":
      return (
        <div className={cn(className, "bg-green-500/10 text-green-500")}>
          <TbBox size={20} />
        </div>
      );
    default:
      return null;
  }
}
