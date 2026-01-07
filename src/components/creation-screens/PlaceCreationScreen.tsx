import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { useForm } from "@tanstack/react-form";
import type { PlaceType } from "@/types/memory.types";
import CreationSection from "@/components/ui/CreationSection";
import TextInput from "@/components/form/TextInput";
import TextArea from "@/components/form/TextArea";
import ImageUploader from "@/components/form/ImageUploader";
import CreationNavbar from "@/components/nav/CreationNavbar";
import * as z from "zod";
import { useNavigate } from "@tanstack/react-router";


const memorySchema = z.object({
    title: z.string().min(1, "Le titre est requis"),
    medias: z.array(z.any()).min(1, "Au moins une image est requise"),
});


export default function PlaceCreationScreen() {
    const navigate = useNavigate();
    const editMoment = useMutation(api.moments.edit);

    const form = useForm({
        defaultValues: {
            title: "",
            description: "",
        } as PlaceType,
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
    return <>
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

            </div>
        </div>
        <CreationNavbar form={form} /></>
}