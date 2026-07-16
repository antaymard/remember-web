import { useOnClickOutside } from "@/hooks/useClickOutside";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  TbBuildingLighthouse,
  TbUserHexagon,
  TbWindmill,
  TbVinyl,
  TbChevronDown,
} from "react-icons/tb";

const memoryTypeOptions = [
  { label: "Moment", value: "moment", icon: TbWindmill },
  { label: "Lieu", value: "place", icon: TbBuildingLighthouse },
  { label: "Personne", value: "person", icon: TbUserHexagon },
  { label: "Objet", value: "thing", icon: TbVinyl },
] as const;

export default function MemoryTypeSelector({
  memoryType,
  setMemoryType,
}: {
  memoryType: "moment" | "place" | "person" | "thing";
  setMemoryType: React.Dispatch<
    React.SetStateAction<"moment" | "place" | "person" | "thing">
  >;
}) {
  const [memoryTypeSelectorOpen, setMemoryTypeSelectorOpen] =
    useState<boolean>(false);
  const memoryTypeSelectorRef = useRef<HTMLDivElement | null>(null);

  useOnClickOutside(
    memoryTypeSelectorRef,
    () => setMemoryTypeSelectorOpen(false),
    memoryTypeSelectorOpen
  );

  const memoryTypeObject = memoryTypeOptions.find(
    (option) => option.value === memoryType
  );

  return (
    <div className="relative">
      <button
        type="button"
        className="flex items-center gap-1.5 rounded-full h-10 font-medium px-4 bg-green/10 text-green"
        onClick={(e) => {
          e.stopPropagation();
          setMemoryTypeSelectorOpen(!memoryTypeSelectorOpen);
        }}
      >
        {memoryTypeObject && <memoryTypeObject.icon size={20} className="" />}
        <span>{memoryTypeObject?.label}</span>
        <TbChevronDown size={20} className="path-stroke-2" />
      </button>
      {memoryTypeSelectorOpen && (
        <div
          ref={memoryTypeSelectorRef}
          className="absolute right-0 top-full mt-2 w-40 bg-white border border-border rounded shadow-lg z-10 overflow-hidden"
        >
          {memoryTypeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setMemoryType(option.value);
                setMemoryTypeSelectorOpen(false);
              }}
              className={cn(
                "flex items-center gap-2 w-full px-4 py-2 hover:bg-green/10",
                memoryType === option.value ? "font-medium bg-green/10" : ""
              )}
            >
              <option.icon size={20} className="" />
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
