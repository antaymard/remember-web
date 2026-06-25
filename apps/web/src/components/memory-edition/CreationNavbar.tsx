import { TbPlayerPauseFilled } from "react-icons/tb";
import { ButtonPastel } from "../ui/Button";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../shadcn/dialog";

interface CreationNavbarProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any; // FormApi from @tanstack/react-form
  hideFinishLater?: boolean;
  submitLabel?: string;
  handleUnfinishedStatus?: boolean;
  canDelete?: boolean;
  onDelete?: () => Promise<void>;
  hasUploadingImages?: boolean;
}

export default function CreationNavbar({
  form,
  hideFinishLater,
  submitLabel = "Créer",
  handleUnfinishedStatus = true,
  canDelete = false,
  onDelete,
  hasUploadingImages = false,
}: CreationNavbarProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  function goBack() {
    router.history.back();
  }

  async function handleDelete() {
    if (onDelete) {
      await onDelete();
    }
    setShowDeleteDialog(false);
    // Redirect to feed instead of going back to avoid querying the deleted memory
    router.navigate({ to: "/feed" });
  }

  function handleFinishLaterClick() {
    if (hasUploadingImages) {
      toast.error(
        "Veuillez attendre la fin de l'upload des images avant de terminer plus tard"
      );
      return;
    }
    if (handleUnfinishedStatus) form.setFieldValue("status", "unfinished");
    form.handleSubmit();
  }

  function handleValidateClick() {
    if (hasUploadingImages) {
      toast.error(
        "Veuillez attendre la fin de l'upload des images avant de valider"
      );
      return;
    }
    if (handleUnfinishedStatus) form.setFieldValue("status", "completed");
    form.handleSubmit();
  }
  return (
    <>
      <form.Subscribe
        selector={(state: {
          canSubmit: boolean;
          isSubmitting: boolean;
          isPristine: boolean;
        }) => [state.canSubmit, state.isSubmitting, state.isPristine]}
      >
        {([canSubmit, isSubmitting, isPristine]: [
          boolean,
          boolean,
          boolean,
        ]) => (
          <nav className="w-full h-20 bg-white px-4 border-t border-gray-200 fixed bottom-0 left-0 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ButtonPastel
                color="red"
                icon={canDelete ? "trash" : "x"}
                onClick={() => {
                  if (canDelete) {
                    setShowDeleteDialog(true);
                  } else {
                    goBack();
                  }
                }}
              />
              {!hideFinishLater && (
                <ButtonPastel
                  color="blue"
                  icon={<TbPlayerPauseFilled size={18} />}
                  label="Terminer + tard"
                  onClick={handleFinishLaterClick}
                  disabled={hasUploadingImages}
                />
              )}
            </div>
            <ButtonPastel
              color="green"
              icon="check"
              label={submitLabel}
              disabled={!canSubmit || isSubmitting || isPristine || hasUploadingImages}
              onClick={handleValidateClick}
            />
          </nav>
        )}
      </form.Subscribe>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le souvenir ?</DialogTitle>
            <DialogDescription>
              Cette action est irréversible. Le souvenir sera définitivement
              supprimé.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row items-center justify-between">
            <ButtonPastel
              color="grey"
              label="Annuler"
              onClick={() => setShowDeleteDialog(false)}
            />
            <ButtonPastel
              color="red"
              label="Supprimer"
              icon="trash"
              onClick={handleDelete}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
