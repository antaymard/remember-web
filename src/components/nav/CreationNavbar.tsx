import { TbPlayerPauseFilled } from "react-icons/tb";
import { ButtonPastel } from "../ui/Button";
import { useRouter } from "@tanstack/react-router";

interface CreationNavbarProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any; // FormApi from @tanstack/react-form
  hideFinishLater?: boolean;
  submitLabel?: string;
}

export default function CreationNavbar({
  form,
  hideFinishLater,
  submitLabel = "Créer",
}: CreationNavbarProps) {
  const router = useRouter();

  function goBack() {
    router.history.back();
  }
  return (
    <form.Subscribe
      selector={(state: {
        canSubmit: boolean;
        isSubmitting: boolean;
        isPristine: boolean;
      }) => [state.canSubmit, state.isSubmitting, state.isPristine]}
    >
      {([canSubmit, isSubmitting, isPristine]: [boolean, boolean, boolean]) => (
        <nav className="w-full h-20 bg-white px-4 border-t border-gray-200 fixed bottom-0 left-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ButtonPastel color="red" icon="x" onClick={goBack} />
            {!hideFinishLater && (
              <ButtonPastel
                color="blue"
                icon={<TbPlayerPauseFilled size={18} />}
                label="Terminer + tard"
                onClick={() => {
                  form.setFieldValue("status", "unfinished");
                  form.handleSubmit();
                }}
              />
            )}
          </div>
          <ButtonPastel
            color="green"
            icon="check"
            label={submitLabel}
            disabled={!canSubmit || isSubmitting || isPristine}
            onClick={() => {
              form.setFieldValue("status", "completed");
              form.handleSubmit();
            }}
          />
        </nav>
      )}
    </form.Subscribe>
  );
}
