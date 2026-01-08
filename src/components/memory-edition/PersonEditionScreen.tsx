import DatePicker from "@/components/form/DatePicker";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import type { PersonType } from "@/types/memory.types";
import CreationSection from "@/components/ui/CreationSection";
import TextInput from "@/components/form/TextInput";
import TextArea from "@/components/form/TextArea";
import * as z from "zod";
import SelectInput from "../form/SelectInput";
import { useCreationForm } from "@/hooks/useCreationForm";
import CreationScreenLayout from "./CreationScreenLayout";
import { defaultFlexibleDate, statusEnum } from "@/utils/creationConstants";
import type { Id } from "@/../convex/_generated/dataModel";

const personSchema = z.object({
  firstname: z.string().min(1, "Le prénom est requis"),
  lastname: z.string().min(1, "Le nom de famille est requis"),
  // medias: z.array(z.any()).min(1, "Au moins une image est requise"),
  type: z.enum(["animal", "human"]),
  status: statusEnum,
});

export default function PersonEditionScreen({
  defaultValues = {},
  action = "create",
  memoryId = null,
}: {
  defaultValues?: Partial<PersonType>;
  action: "create" | "edit";
  memoryId?: Id<"persons"> | null;
}) {
  const editPerson = useMutation(api.persons.edit);
  const trashMemory = useMutation(api.memories.trash);

  const form = useCreationForm({
    defaultValues: {
      gender: "",
      type: "human",
      firstname: "",
      lastname: "",
      medias: [],
      relation_type: "",
      relation_name: "",
      description: "",
      birth_date: defaultFlexibleDate,
      death_date: defaultFlexibleDate,
      first_met: defaultFlexibleDate,
      last_seen: defaultFlexibleDate,
      status: "unfinished",
      ...defaultValues,
    } as PersonType,
    mutationFn: async (value) => {
      // Ensure type is set correctly
      const personData = {
        ...value,
        type: value.type || ("human" as "human" | "animal"),
      };
      return editPerson(
        action === "edit" ? { ...personData, _id: memoryId! } : personData
      );
    },
    schema: personSchema,
  });

  return (
    <CreationScreenLayout
      form={form}
      submitLabel={action === "create" ? "Créer" : "Enregistrer"}
      canDelete={action === "edit"}
      onDelete={async () => {
        if (memoryId) {
          await trashMemory({ type: "person", _id: memoryId });
        }
      }}
    >
      <CreationSection label="Général">
        <TextInput
          form={form}
          name="firstname"
          placeholder="Prénom"
          icon="title"
        />
        <TextInput
          form={form}
          name="lastname"
          placeholder="Nom de famille"
          icon="title"
        />

        <div className="grid grid-cols-2 gap-2">
          <SelectInput
            form={form}
            name="type"
            placeholder="Type"
            options={[
              { value: "human", label: "Humain" },
              { value: "animal", label: "Animal" },
            ]}
          />
          <SelectInput
            form={form}
            name="gender"
            placeholder="Genre"
            options={[
              { value: "male", label: "Masculin" },
              { value: "female", label: "Féminin" },
            ]}
          />
        </div>
      </CreationSection>

      <CreationSection label="Lien">
        <SelectInput
          form={form}
          name="relation_type"
          placeholder="Type de relation"
          options={[
            { value: "family", label: "Famille" },
            { value: "friend", label: "Ami" },
            { value: "colleague", label: "Collègue" },
            { value: "acquaintance", label: "Connaissance" },
            { value: "teacher", label: "Enseignant / Mentor" },
            { value: "other", label: "Autre" },
          ]}
        />
        <TextInput
          form={form}
          name="relation_name"
          placeholder="Lien précis. Ex : Cousin"
          icon="text"
        />
        <TextArea
          form={form}
          name="description"
          placeholder="Pourquoi cette personne est-elle importante ?"
        />
      </CreationSection>

      <CreationSection label="Temporel">
        <div className="grid grid-cols-2 gap-2">
          <DatePicker form={form} name="birth_date" placeholder="Naissance" />
          <DatePicker form={form} name="death_date" placeholder="Décès" />
          <DatePicker form={form} name="first_met" placeholder="Rencontre" />
          <DatePicker
            form={form}
            name="last_seen"
            placeholder="Dernier contact"
          />
        </div>
      </CreationSection>
    </CreationScreenLayout>
  );
}
