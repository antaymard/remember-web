import { useState, useEffect } from "react";
import { TbBell, TbCheck, TbX, TbAlertTriangle } from "react-icons/tb";
import { useNotifications } from "@/hooks/useNotifications";
import { isBraveBrowser } from "@/lib/browserDetection";

const DISMISSED_KEY = "notification-banner-dismissed";
const BRAVE_WARNING_DISMISSED_KEY = "brave-warning-dismissed";

export function NotificationBanner() {
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(DISMISSED_KEY) === "true",
  );
  const [braveWarningDismissed, setBraveWarningDismissed] = useState(
    () => localStorage.getItem(BRAVE_WARNING_DISMISSED_KEY) === "true",
  );
  const [isBrave, setIsBrave] = useState(false);
  const { enableNotifications, isDefault, isSupported } = useNotifications();

  // Détecter Brave au mount
  useEffect(() => {
    isBraveBrowser().then(setIsBrave);
  }, []);

  // Si Brave détecté, afficher le warning (sauf si dismissed)
  if (isBrave && !braveWarningDismissed) {
    return (
      <div className="space-y-5 text-white bg-yellow-600 p-3">
        <div className="mt-2 flex gap-5 items-center">
          <TbAlertTriangle className="shrink-0" size={24} />
          <div className="flex-1 min-w-0">
            <p className="font-medium">Brave bloque les notifications web</p>
            <p className="text-sm">
              Pour recevoir des notifications, utilisez Chrome, Edge ou Firefox.
              Sur mobile, installez l'app depuis le menu du navigateur.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end">
          <button
            onClick={() => {
              setBraveWarningDismissed(true);
              localStorage.setItem(BRAVE_WARNING_DISMISSED_KEY, "true");
            }}
            className="flex items-center shrink-0 bg-white/20 rounded-sm h-10 px-3 gap-2"
          >
            <TbX size={24} />
            Compris
          </button>
        </div>
      </div>
    );
  }

  // Ne rien afficher si : déjà dismissed, pas supporté, ou déjà répondu (granted/denied)
  if (dismissed || !isSupported || !isDefault) return null;

  const handleEnable = async () => {
    await enableNotifications();
    setDismissed(true);
    localStorage.setItem(DISMISSED_KEY, "true");
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem(DISMISSED_KEY, "true");
  };

  return (
    <div className="space-y-5 text-white bg-green p-3">
      <div className="mt-2 flex gap-5 items-center">
        <TbBell className="shrink-0" size={24} />
        <div className="flex-1 min-w-0">
          <p className="font-medium ">Activez les notifications</p>
          <p className="text-sm">
            Soyez notifié quand un ami ajoute un souvenir de vous !
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <button
          onClick={handleDismiss}
          className="flex items-center shrink-0 bg-white/20 rounded-sm h-10 px-3 gap-2"
        >
          <TbX size={24} />
          Refuser
        </button>
        <button
          onClick={handleEnable}
          type="button"
          className="flex items-center shrink-0 bg-white/20 rounded-sm h-10 px-3 gap-2 font-medium text-white"
        >
          <TbCheck size={24} />
          Activer
        </button>
      </div>
    </div>
  );
}
