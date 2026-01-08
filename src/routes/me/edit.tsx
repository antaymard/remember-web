import ImageUploader from "@/components/form/ImageUploader";
import SelectInput from "@/components/form/SelectInput";
import TextInput from "@/components/form/TextInput";
import CreationNavbar from "@/components/nav/CreationNavbar";
import Header from "@/components/nav/Header";
import CreationSection from "@/components/ui/CreationSection";
import { useUser } from "@/contexts/userContext";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { api } from "@/../convex/_generated/api";
import { useMutation } from "convex/react";
import toast from "react-hot-toast";

export const Route = createFileRoute("/me/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { user } = useUser();
  const editMe = useMutation(api.users.editMe);

  const form = useForm({
    defaultValues: {
      firstname: user?.firstname ?? "",
      lastname: user?.lastname ?? "",
      email: user?.email ?? "",
      gender: user?.gender ?? "",
      medias: user?.medias ?? [],
    },
    onSubmit: async ({ value }) => {
      try {
        console.log("Profile mis à jour:", value);
        toast.success("Profil mis à jour avec succès");
        await editMe(value);
        navigate({ to: "/me" });
      } catch (error) {
        console.error("Erreur lors de la mise à jour du profil:", error);
        toast.error("Erreur lors de la mise à jour du profil");
      }
    },
  });

  return (
    <div>
      <Header
        title="Modifier profil"
        showBackArrow
        onArrowBackClick={() => navigate({ to: "/me" })}
      />
      <div className="py-17.5 flex flex-col bg-bg">
        <ImageUploader form={form} name="medias" hideReorderButtons />
        <div className="space-y-2 5">
          <CreationSection label="Général">
            <TextInput name="firstname" form={form} placeholder="Prénom" />
            <TextInput name="lastname" form={form} placeholder="Nom" />
            <TextInput
              name="email"
              form={form}
              placeholder="Email"
              icon="mail"
            />
            <SelectInput
              form={form}
              placeholder="Genre"
              name="gender"
              options={[
                { label: "Masculin", value: "male" },
                { label: "Féminin", value: "female" },
              ]}
            />
          </CreationSection>
        </div>
      </div>
      <CreationNavbar
        form={form}
        hideFinishLater
        submitLabel="OK"
        handleUnfinishedStatus={false}
      />
    </div>
  );
}
