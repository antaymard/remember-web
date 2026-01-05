import { cn } from "@/lib/utils";
import { TbAspectRatio } from "react-icons/tb";

const CN = {
  smallButton:
    "bg-white rounded-sm p-1 h-8 flex h-7.5 w-7.5 items-center justify-center disabled:opacity-50",
};

export default function ImageUploader() {
  return (
    <div className="relative aspect-square w-screen bg-greylight">
      <button
        type="button"
        className={cn(CN.smallButton, "absolute top-4 left-4")}
      >
        <TbAspectRatio size={18} className="path-stroke-2" />
      </button>
    </div>
  );
}
