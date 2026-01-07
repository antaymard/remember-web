import Switcher from "@/components/form/Swticher";
import DatePicker from "@/components/form/DatePicker";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { useForm } from "@tanstack/react-form";
import type { MomentType, ThingType } from "@/types/memory.types";
import CreationSection from "@/components/ui/CreationSection";
import TextInput from "@/components/form/TextInput";
import TextArea from "@/components/form/TextArea";
import { TbLockSquareRoundedFilled } from "react-icons/tb";
import ImageUploader from "@/components/form/ImageUploader";
import CreationNavbar from "@/components/nav/CreationNavbar";
import * as z from "zod";
import { useNavigate } from "@tanstack/react-router";
import SelectInput from "../form/SelectInput";


const memorySchema = z.object({
    title: z.string().min(1, "Le titre est requis"),
    medias: z.array(z.any()).min(1, "Au moins une image est requise"),
    type: z.enum(["physical", "music", "film", "book"], {
        message: "Le type sélectionné n'est pas valide"
    }),
});

const defaultFlexibleDate = {
    year: undefined,
    month: undefined,
    day: undefined,
    hour: undefined,
    min: undefined,
}

export default function ThingCreationScreen() {
    const navigate = useNavigate();
    const editThing = useMutation(api.things.edit);

    const form = useForm({
        defaultValues: {
            title: "",
            description: "",
            medias: [],
            type: "physical",
            first_met: defaultFlexibleDate,
            last_seen: defaultFlexibleDate,
        } as ThingType,
        onSubmit: async ({ value }) => {
            try {
                const momentId = await editThing(value);
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
    return <>
        {/* Content */}
        <div className="py-17.5 bg-bg min-h-screen">
            <ImageUploader form={form} name="medias" />

            <div className="space-y-2.5 pb-32">
                <CreationSection label="Général">
                    <TextInput form={form} name="title" placeholder="Titre" />
                    <SelectInput form={form} name="type" placeholder="Type" options={[
                        { label: "Objet physique", value: "physical" },
                        { label: "Musique", value: "music" },
                        { label: "Film", value: "film" },
                        { label: "Livre", value: "book" },
                    ]} />
                </CreationSection>
                <CreationSection label="Description">
                    <TextArea
                        form={form}
                        name="description"
                        placeholder="Racontez ce qu'il s'est passé !"
                    />
                </CreationSection>

                <CreationSection label="Temporel">
                    <DatePicker form={form} name="first_met" placeholder="Premier contact / acquisition" />
                    <DatePicker form={form} name="last_seen" placeholder="Dernier contact" />
                </CreationSection>
            </div>
        </div>
        <CreationNavbar form={form} /></>
}