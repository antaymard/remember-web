import { createFileRoute } from "@tanstack/react-router";
import ImageUploader from "@/components/form/ImageUploader";
import CreationNavbar from "@/components/nav/CreationNavbar";
import Header from "@/components/nav/Header";
import { useForm } from "@tanstack/react-form";
import CreationSection from "@/components/ui/CreationSection";
import TextInput from "@/components/form/TextInput";
import TextArea from "@/components/form/TextArea";
import TimePicker from "@/components/form/TimePicker";
import {
  TbBuildingLighthouse,
  TbUserHexagon,
  TbWindmill,
  TbVinyl,
  TbChevronDown,
  TbLockSquareRoundedFilled,
} from "react-icons/tb";
import { useRef, useState } from "react";
import { useOnClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/lib/utils";
import Switcher from "@/components/form/Swticher";

const memoryTypeOptions = [
  { label: "Moment", value: "moment", icon: TbWindmill },
  { label: "Lieu", value: "place", icon: TbBuildingLighthouse },
  { label: "Personne", value: "person", icon: TbUserHexagon },
  { label: "Objet", value: "thing", icon: TbVinyl },
] as const;

export const Route = createFileRoute("/create-memory")({
  component: RouteComponent,
});

function RouteComponent() {
  const [memoryType, setMemoryType] = useState<
    "moment" | "place" | "person" | "thing"
  >("moment");
  const [memoryTypeSelectorOpen, setMemoryTypeSelectorOpen] =
    useState<boolean>(false);
  const memoryTypeSelectorRef = useRef<HTMLDivElement | null>(null);

  useOnClickOutside(
    memoryTypeSelectorRef,
    () => setMemoryTypeSelectorOpen(false),
    memoryTypeSelectorOpen
  );

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      is_secret: false,
      medias: [],
      date_time_in: {
        year: undefined,
        month: undefined,
        day: undefined,
        hour: undefined,
        min: undefined,
      },
    },
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  const memoryTypeObject = memoryTypeOptions.find(
    (option) => option.value === memoryType
  );

  return (
    <div>
      <Header
        title="Créer"
        rightContent={
          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-full h-10 font-medium px-4 bg-green/10 text-green"
              onClick={(e) => {
                e.stopPropagation();
                setMemoryTypeSelectorOpen(!memoryTypeSelectorOpen);
              }}
            >
              {memoryTypeObject && (
                <memoryTypeObject.icon size={20} className="" />
              )}
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
                      memoryType === option.value
                        ? "font-medium bg-green/10"
                        : ""
                    )}
                  >
                    <option.icon size={20} className="" />
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        }
      />

      {/* Content */}
      <div className="py-17.5 bg-bg min-h-screen">
        <ImageUploader form={form} name="medias" />

        <div className="space-y-2.5 pb-32">
          <CreationSection label="Général">
            <TextInput form={form} name="title" placeholder="Titre" />
          </CreationSection>
          <CreationSection label="Description">
            <TextArea
              form={form}
              name="description"
              placeholder="Racontez ce qu'il s'est passé !"
            />
          </CreationSection>
          <CreationSection label="heure">
            <TimePicker form={form} name="date_time_in" />
          </CreationSection>
          <CreationSection label="Personnes présentes">TODO</CreationSection>
          <CreationSection label="Partage">TODO</CreationSection>
          <CreationSection label="Visibilité">
            <Switcher
              form={form}
              name="is_secret"
              label="Rendre secret"
              icon={TbLockSquareRoundedFilled}
            />
          </CreationSection>
        </div>
      </div>
      <CreationNavbar form={form} />
    </div>
  );
}
