import Switcher from "@/components/form/Swticher";
import DatePicker from "@/components/form/DatePicker";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { useForm } from "@tanstack/react-form";
import type { MomentType } from "@/types/memory.types";
import CreationSection from "@/components/ui/CreationSection";
import TextInput from "@/components/form/TextInput";
import TextArea from "@/components/form/TextArea";
import TimePicker from "@/components/form/TimePicker";
import { TbClockPin, TbUserHeart } from "react-icons/tb";
import ImageUploader from "@/components/form/ImageUploader";
import CreationNavbar from "@/components/nav/CreationNavbar";
import * as z from "zod";
import { useNavigate } from "@tanstack/react-router";
import PersonPicker from "../form/PersonPicker";

const memorySchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  // medias: z.array(z.any()).min(1, "Au moins une image est requise"),
  status: z.enum(["unfinished", "completed", "archived"]),
});

export default function MomentCreationScreen() {
  const navigate = useNavigate();
  const editMoment = useMutation(api.moments.edit);

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
      present_persons: [],
      status: "unfinished",
    } as MomentType,
    onSubmit: async ({ value }) => {
      try {
        await editMoment(value);
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
    <>
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

          <CreationSection label="Personnes présentes">
            <PersonPicker form={form} name="present_persons" />
          </CreationSection>
          <CreationSection label="Partage">
            <Switcher
              form={form}
              name="is_shared_with_present_persons"
              label="Partager avec les personnes présentes"
              icon={TbUserHeart}
            />
          </CreationSection>
          {/* <CreationSection label="Visibilité">
            <Switcher
              form={form}
              name="is_secret"
              label="Rendre secret"
              icon={TbLockSquareRoundedFilled}
            />
          </CreationSection> */}
        </div>
      </div>
      <CreationNavbar form={form} />
    </>
  );
}
