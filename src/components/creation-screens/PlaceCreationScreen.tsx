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

const placeSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  //   medias: z.array(z.any()).min(1, "Au moins une image est requise"),
  status: statusEnum,
});

export default function PlaceCreationScreen() {
  const editPlace = useMutation(api.places.edit);

  const form = useCreationForm({
    defaultValues: {
      title: "",
      description: "",
      medias: [],
      status: "unfinished",
    } as PlaceType,
    mutationFn: editPlace,
    schema: placeSchema,
  });

  return (
    <CreationScreenLayout form={form}>
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
