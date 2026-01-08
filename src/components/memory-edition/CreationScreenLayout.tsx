import type { ReactNode } from "react";
import ImageUploader from "@/components/form/ImageUploader";
import CreationNavbar from "@/components/memory-edition/CreationNavbar";

interface CreationScreenLayoutProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any; // FormApi from @tanstack/react-form
  children: ReactNode;
  showImageUploader?: boolean;
  submitLabel?: string;
  canDelete?: boolean;
  onDelete?: () => Promise<void>;
}

export default function CreationScreenLayout({
  form,
  children,
  showImageUploader = true,
  submitLabel,
  canDelete = false,
  onDelete,
}: CreationScreenLayoutProps) {
  return (
    <>
      <div className="py-17.5 bg-bg min-h-screen">
        {showImageUploader && <ImageUploader form={form} name="medias" />}
        <div className="space-y-2.5 pb-32">{children}</div>
      </div>
      <CreationNavbar
        form={form}
        submitLabel={submitLabel}
        canDelete={canDelete}
        onDelete={onDelete}
      />
    </>
  );
}
