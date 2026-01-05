import { cn } from "@/lib/utils";
import {
  TbAspectRatio,
  TbArrowMoveLeft,
  TbArrowMoveRight,
  TbTrash,
  TbPlus,
} from "react-icons/tb";

const buttonClassName =
  "bg-white  p-1 h-8 flex  items-center justify-center disabled:opacity-50";

const smallButtonClassName = cn(buttonClassName, "h-7.5 w-7.5 rounded-sm");
const bigButtonClassName = cn(buttonClassName, "h-12.5 w-12.5 rounded-2xl");

const smallIconSize = 20;
const bigIconSize = 22;

export default function ImageUploader({ form }: { form: any }) {
  return (
    <div className="relative aspect-square w-screen bg-greylight">
      <button
        type="button"
        className={cn(smallButtonClassName, "absolute top-4 left-4")}
      >
        <TbAspectRatio size={smallIconSize} className="" />
      </button>
      <div className="absolute flex items-center gap-2 top-4 right-4">
        <button type="button" className={cn(smallButtonClassName)}>
          <TbArrowMoveLeft size={smallIconSize} className="" />
        </button>
        <button type="button" className={cn(smallButtonClassName)}>
          <TbArrowMoveRight size={smallIconSize} className="" />
        </button>
      </div>
      <button
        type="button"
        className={cn(bigButtonClassName, "absolute bottom-4 left-4 text-red")}
      >
        <TbTrash size={bigIconSize} className="" />
      </button>
      <button
        type="button"
        className={cn(
          bigButtonClassName,
          "absolute bottom-4 right-4 text-green"
        )}
      >
        <TbPlus size={bigIconSize} className="" />
      </button>
    </div>
  );
}
