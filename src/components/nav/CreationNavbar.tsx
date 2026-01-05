import { TbPlayerPauseFilled } from "react-icons/tb";
import { ButtonPastel } from "../ui/Button";
import { useRouter } from "@tanstack/react-router";

export default function CreationNavbar() {
  const router = useRouter();

  function goBack() {
    router.history.back();
  }
  return (
    <nav className="w-full h-20 bg-white px-4 border-t border-gray-200 fixed bottom-0 left-0 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <ButtonPastel color="red" icon="x" onClick={goBack} />
        <ButtonPastel
          color="blue"
          icon={<TbPlayerPauseFilled size={18} />}
          label="Terminer + tard"
        />
      </div>
      <ButtonPastel color="green" icon="check" label="Créer" />
    </nav>
  );
}
