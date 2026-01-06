import { createFileRoute, useNavigate } from "@tanstack/react-router";
import ImageUploader from "@/components/form/ImageUploader";
import CreationNavbar from "@/components/nav/CreationNavbar";
import Header from "@/components/nav/Header";
import { useForm } from "@tanstack/react-form";
import type { MomentType } from "@/types/memory.types";
import CreationSection from "@/components/ui/CreationSection";
import TextInput from "@/components/form/TextInput";
import TextArea from "@/components/form/TextArea";
import TimePicker from "@/components/form/TimePicker";
import { TbLockSquareRoundedFilled, TbClockPin } from "react-icons/tb";
import { useState } from "react";
import Switcher from "@/components/form/Swticher";
import DatePicker from "@/components/form/DatePicker";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import MemoryTypeSelector from "@/components/nav/MemoryTypeSelector";
import * as z from "zod";

export const Route = createFileRoute("/create-memory")({
  component: RouteComponent,
});

const memorySchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
});

function RouteComponent() {
  const navigate = useNavigate();
  const editMoment = useMutation(api.moments.edit);

  const [memoryType, setMemoryType] = useState<
    "moment" | "place" | "person" | "thing"
  >("moment");

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
    } as MomentType,
    onSubmit: async ({ value }) => {
      try {
        const momentId = await editMoment(value);
        console.log("Moment créé:", momentId);
        // Rediriger vers le feed ou la page de détail après création
        navigate({ to: "/feed" });
      } catch (error) {
        console.error("Erreur lors de la création:", error);
      }
    },
    validators: {
      onSubmit: memorySchema,
    },
  });

  return (
    <div>
      <Header
        title="Créer"
        rightContent={
          <MemoryTypeSelector
            memoryType={memoryType}
            setMemoryType={setMemoryType}
          />
        }
      />

      {/* Content */}
      <div className="py-17.5 bg-bg min-h-screen">
        <ImageUploader form={form} name="medias" />

        <div className="space-y-2.5 pb-32">
          <CreationSection label="Général">
            <TextInput form={form} name="title" placeholder="Titre" />
            <div className="grid grid-cols-[1fr_auto_50px] gap-2">
              <DatePicker form={form} name="date_time_in" placeholder="Date" />
              <TimePicker form={form} name="date_time_in" placeholder="Heure" />
              <button
                type="button"
                onClick={() => {
                  const now = new Date();
                  form.setFieldValue("date_time_in", {
                    year: now.getFullYear(),
                    month: now.getMonth() + 1,
                    day: now.getDate(),
                    hour: now.getHours(),
                    min: now.getMinutes(),
                  });
                }}
                className="h-12.5 w-12.5 rounded bg-bg text-grey focus:ring-2 ring-text outline-0 flex items-center justify-center"
              >
                <TbClockPin size={24} />
              </button>
            </div>
          </CreationSection>
          <CreationSection label="Description">
            <TextArea
              form={form}
              name="description"
              placeholder="Racontez ce qu'il s'est passé !"
            />
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
