import DatePicker from "@/components/form/DatePicker";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import type { ThingType } from "@/types/memory.types";
import { thingTypes } from "@/types/memory.types";
import CreationSection from "@/components/ui/CreationSection";
import TextInput from "@/components/form/TextInput";
import TextArea from "@/components/form/TextArea";
import UserPicker from "../form/UserPicker";
import * as z from "zod";
import SelectInput from "../form/SelectInput";
import { useCreationForm } from "@/hooks/useCreationForm";
import CreationScreenLayout from "./CreationScreenLayout";
import { defaultFlexibleDateTime, statusEnum } from "@/utils/creationConstants";
import type { Id } from "node_modules/convex/dist/esm-types/values/value";

const thingSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  // medias: z.array(z.any()).min(1, "Au moins une image est requise"),
  type: z.enum(thingTypes, {
    message: "Le type sélectionné n'est pas valide",
  }),
  status: statusEnum,
});

export default function ThingEditionScreen({
  defaultValues = {},
  action = "create",
  memoryId = null,
}: {
  defaultValues?: Partial<ThingType>;
  action: "create" | "edit";
  memoryId?: Id<"things"> | null;
}) {
  const editThing = useMutation(api.things.edit);
  const trashMemory = useMutation(api.memories.trash);

  const form = useCreationForm({
    defaultValues: {
      title: "",
      description: "",
      medias: [],
      type: "physical",
      first_met: defaultFlexibleDateTime,
      last_seen: defaultFlexibleDateTime,
      shared_with_users: [],
      status: "unfinished",
      ...defaultValues,
    } as ThingType,
    mutationFn: async (value) => {
      // Ensure type is set correctly

      return await editThing(
        action === "edit" ? { ...value, _id: memoryId! } : value
      );
    },
    schema: thingSchema,
  });

  return (
    <CreationScreenLayout
      form={form}
      submitLabel={action === "create" ? "Créer" : "Enregistrer"}
      canDelete={action === "edit"}
      onDelete={async () => {
        if (memoryId) {
          await trashMemory({ type: "thing", _id: memoryId });
        }
      }}
    >
      <CreationSection label="Général">
        <TextInput form={form} name="title" placeholder="Titre" />
        <SelectInput
          form={form}
          name="type"
          placeholder="Type"
          options={[
            { label: "Objet physique", value: "physical" },
            { label: "Musique", value: "music" },
            { label: "Film", value: "film" },
            { label: "Livre", value: "book" },
          ]}
        />
      </CreationSection>
      <CreationSection label="Description">
        <TextArea
          form={form}
          name="description"
          placeholder="Racontez ce qu'il s'est passé !"
        />
      </CreationSection>

      <CreationSection label="Temporel">
        <DatePicker
          form={form}
          name="first_met"
          placeholder="Premier contact / acquisition"
        />
        <DatePicker
          form={form}
          name="last_seen"
          placeholder="Dernier contact"
        />
      </CreationSection>

      <CreationSection label="Partage">
        <UserPicker form={form} name="shared_with_users" />
      </CreationSection>
    </CreationScreenLayout>
  );
}
