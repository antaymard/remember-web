import Switcher from "@/components/form/Swticher";
import DatePicker from "@/components/form/DatePicker";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import type { MomentType } from "@/types/memory.types";
import CreationSection from "@/components/ui/CreationSection";
import TextInput from "@/components/form/TextInput";
import TextArea from "@/components/form/TextArea";
import TimePicker from "@/components/form/TimePicker";
import { TbClockPin, TbUserHeart } from "react-icons/tb";
import * as z from "zod";
import PersonPicker from "../form/PersonPicker";
import { useCreationForm } from "@/hooks/useCreationForm";
import CreationScreenLayout from "./CreationScreenLayout";
import { defaultFlexibleDateTime, statusEnum } from "@/utils/creationConstants";
import type { Id } from "@/../convex/_generated/dataModel";

const memorySchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  // medias: z.array(z.any()).min(1, "Au moins une image est requise"),
  status: statusEnum,
});

export default function MomentEditionScreen({
  defaultValues = {},
  action = "create",
  memoryId = null,
}: {
  defaultValues?: Partial<MomentType>;
  action: "create" | "edit";
  memoryId?: Id<"moments"> | null;
}) {
  const editMoment = useMutation(api.moments.edit);
  const trashMemory = useMutation(api.memories.trash);

  const form = useCreationForm({
    defaultValues: {
      title: "",
      description: "",
      is_secret: false,
      medias: [],
      date_time_in: defaultFlexibleDateTime,
      present_persons: [],
      status: "unfinished",
      ...defaultValues,
    } as MomentType,
    mutationFn: (value) =>
      editMoment(action === "edit" ? { ...value, _id: memoryId! } : value),
    schema: memorySchema,
  });

  return (
    <CreationScreenLayout
      form={form}
      submitLabel={action === "create" ? "Créer" : "Enregistrer"}
      canDelete={action === "edit"}
      onDelete={async () => {
        if (memoryId) {
          await trashMemory({ type: "moment", _id: memoryId });
        }
      }}
    >
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
    </CreationScreenLayout>
  );
}
