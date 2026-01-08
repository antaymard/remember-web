import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import type { PlaceType } from "@/types/memory.types";
import CreationSection from "@/components/ui/CreationSection";
import TextInput from "@/components/form/TextInput";
import TextArea from "@/components/form/TextArea";
import * as z from "zod";
import { useCreationForm } from "@/hooks/useCreationForm";
import CreationScreenLayout from "./CreationScreenLayout";
import { statusEnum } from "@/utils/creationConstants";
import type { Id } from "@/../convex/_generated/dataModel";

const placeSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  //   medias: z.array(z.any()).min(1, "Au moins une image est requise"),
  status: statusEnum,
});

export default function PlaceEditionScreen({
  defaultValues = {},
  action = "create",
  memoryId = null,
}: {
  defaultValues?: Partial<PlaceType>;
  action: "create" | "edit";
  memoryId?: Id<"places"> | null;
}) {
  const editPlace = useMutation(api.places.edit);
  const trashMemory = useMutation(api.memories.trash);

  const form = useCreationForm({
    defaultValues: {
      title: "",
      description: "",
      medias: [],
      status: "unfinished",
      ...defaultValues,
    } as PlaceType,
    mutationFn: (value) =>
      editPlace(action === "edit" ? { ...value, _id: memoryId! } : value),
    schema: placeSchema,
  });

  return (
    <CreationScreenLayout
      form={form}
      submitLabel={action === "create" ? "Créer" : "Enregistrer"}
      canDelete={action === "edit"}
      onDelete={async () => {
        if (memoryId) {
          await trashMemory({ type: "place", _id: memoryId });
        }
      }}
    >
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
    </CreationScreenLayout>
  );
}
