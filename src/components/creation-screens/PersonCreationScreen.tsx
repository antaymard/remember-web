import DatePicker from "@/components/form/DatePicker";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { useForm } from "@tanstack/react-form";
import type { PersonType } from "@/types/memory.types";
import CreationSection from "@/components/ui/CreationSection";
import TextInput from "@/components/form/TextInput";
import TextArea from "@/components/form/TextArea";
import { TbUser } from "react-icons/tb";
import ImageUploader from "@/components/form/ImageUploader";
import CreationNavbar from "@/components/nav/CreationNavbar";
import * as z from "zod";
import { useNavigate } from "@tanstack/react-router";
import SelectInput from "../form/SelectInput";

const personSchema = z.object({
  firstname: z.string().min(1, "Le prénom est requis"),
  lastname: z.string().min(1, "Le nom de famille est requis"),
  medias: z.array(z.any()).min(1, "Au moins une image est requise"),
  type: z.enum(["animal", "human"]),
});

const defaultFlexibleDateTime = {
  year: 0,
  month: 0,
  day: 0,
  hour: 0,
  min: 0,
};

export default function PersonCreationScreen() {
  const navigate = useNavigate();
  const editPerson = useMutation(api.persons.edit);

  const form = useForm({
    defaultValues: {
      gender: "",
      type: "human",
      firstname: "",
      lastname: "",
      medias: [],
      relation_type: "",
      relation_name: "",
      description: "",
      birth_date: defaultFlexibleDateTime,
      death_date: defaultFlexibleDateTime,
      first_met: defaultFlexibleDateTime,
      last_seen: defaultFlexibleDateTime,
    } as PersonType,
    onSubmit: async ({ value }) => {
      try {
        await editPerson(value);
        console.log("Personne créé:");
        // Rediriger vers le feed ou la page de détail après création
        navigate({ to: "/feed" });
      } catch (error) {
        console.error("Erreur lors de la création:", error);
      }
    },
    validators: {
      onSubmit: personSchema,
    },
  });
  return (
    <>
      {/* Content */}
      <div className="py-17.5 bg-bg min-h-screen">
        <ImageUploader form={form} name="medias" />

        <div className="space-y-2.5 pb-32">
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
                icon={TbUser}
                options={[
                  { value: "human", label: "Humain" },
                  { value: "animal", label: "Animal" },
                ]}
              />
              <SelectInput
                form={form}
                name="gender"
                placeholder="Genre"
                icon={TbUser}
                options={[
                  { value: "male", label: "Homme" },
                  { value: "female", label: "Femme" },
                ]}
              />
            </div>
          </CreationSection>

          <CreationSection label="Lien">
            <SelectInput
              form={form}
              name="relation_type"
              placeholder="Type de relation"
              icon={TbUser}
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
              <DatePicker
                form={form}
                name="birth_date"
                placeholder="Naissance"
              />
              <DatePicker form={form} name="death_date" placeholder="Décès" />
              <DatePicker
                form={form}
                name="first_met"
                placeholder="Rencontre"
              />
              <DatePicker
                form={form}
                name="last_seen"
                placeholder="Dernier contact"
              />
            </div>
          </CreationSection>
        </div>
      </div>
      <CreationNavbar form={form} />
    </>
  );
}
