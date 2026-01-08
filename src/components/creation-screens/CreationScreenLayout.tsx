import type { ReactNode } from "react";
import ImageUploader from "@/components/form/ImageUploader";
import CreationNavbar from "@/components/nav/CreationNavbar";
import type { FormApi } from "@tanstack/react-form";

interface CreationScreenLayoutProps<T> {
  form: FormApi<T, any>;
  children: ReactNode;
  showImageUploader?: boolean;
}

export default function CreationScreenLayout<T>({
  form,
  children,
  showImageUploader = true,
}: CreationScreenLayoutProps<T>) {
  return (
    <>
      <div className="py-17.5 bg-bg min-h-screen">
        {showImageUploader && <ImageUploader form={form} name="medias" />}
        <div className="space-y-2.5 pb-32">{children}</div>
      </div>
      <CreationNavbar form={form} />
    </>
  );
}
