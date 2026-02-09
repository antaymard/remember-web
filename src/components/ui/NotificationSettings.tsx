import {
  TbBell,
  TbBellOff,
  TbBellRinging,
  TbAlertTriangle,
  TbChevronRight,
} from "react-icons/tb";
import { useNotifications } from "@/hooks/useNotifications";

export function NotificationSettings() {
  const { permissionStatus, enableNotifications, isSupported } =
    useNotifications();

  if (!isSupported) {
    return (
      <div className="flex items-center gap-3 py-3 px-4">
        <TbAlertTriangle size={20} className="text-yellow-500" />
        <div className="flex-1">
          <div className="font-medium">Notifications</div>
          <div className="text-xs text-gray-500">
            Non supportées par votre navigateur
          </div>
        </div>
      </div>
    );
  }

  const handleClick = () => {
    if (permissionStatus === "default") {
      enableNotifications();
    } else if (permissionStatus === "denied") {
      // On ne peut pas re-demander si denied : guider l'utilisateur
      window.open(
        "https://support.google.com/chrome/answer/3220216?hl=fr",
        "_blank",
      );
    }
  };

  return (
    <div
      className="flex items-center justify-between py-3 cursor-pointer px-4"
      onClick={handleClick}
    >
      <div className="flex items-center gap-2">
        {permissionStatus === "granted" ? (
          <TbBellRinging size={20} className="text-green-500" />
        ) : permissionStatus === "denied" ? (
          <TbBellOff size={20} className="text-red-500" />
        ) : (
          <TbBell size={20} />
        )}
        <div className="font-medium">Notifications</div>
        {permissionStatus === "granted" && (
          <div className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
            Activées
          </div>
        )}
        {permissionStatus === "denied" && (
          <div className="bg-red-100 text-red-700 text-xs font-medium px-2 py-0.5 rounded-full">
            Bloquées
          </div>
        )}
      </div>
      {permissionStatus !== "granted" && <TbChevronRight size={20} />}
    </div>
  );
}
