import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  requestNotificationPermission,
  getNotificationPermissionStatus,
  onForegroundMessage,
} from "../lib/firebase";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";

/** Génère un nom lisible pour le device actuel */
function getDeviceName(): string {
  const ua = navigator.userAgent;
  let browser = "Navigateur inconnu";
  let os = "";

  // Détection navigateur
  if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Edg")) browser = "Edge";
  else if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Chrome";
  else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
  else if (ua.includes("Opera") || ua.includes("OPR")) browser = "Opera";

  // Détection OS
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac OS")) os = "macOS";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
  else if (ua.includes("Linux")) os = "Linux";

  return os ? `${browser} — ${os}` : browser;
}

export function useNotifications() {
  const [permissionStatus, setPermissionStatus] = useState<
    NotificationPermission | "unsupported" | "loading"
  >(() => getNotificationPermissionStatus());

  const saveToken = useMutation(api.pushSubscriptions.saveToken);

  // Écouter les messages reçus quand l'app est au premier plan
  useEffect(() => {
    const unsubscribe = onForegroundMessage((payload) => {
      if (payload.notification) {
        toast(payload.notification.title ?? "Notification", {
          icon: "🔔",
        });
      }
    });
    return unsubscribe;
  }, []);

  const enableNotifications = useCallback(async () => {
    console.log("[Notif] enableNotifications called");
    try {
      const token = await requestNotificationPermission();
      console.log("[Notif] token received:", token);
      if (token) {
        await saveToken({
          fcmToken: token,
          platform: "web",
          deviceName: getDeviceName(),
          userAgent: navigator.userAgent,
        });
        console.log("[Notif] token saved to Convex");
        setPermissionStatus("granted");
        toast.success("Notifications activées !");
        return true;
      } else {
        const status = getNotificationPermissionStatus();
        console.log("[Notif] no token, permission status:", status);
        setPermissionStatus(status);
        if (status === "denied") {
          toast.error(
            "Notifications bloquées. Activez-les dans les paramètres de votre navigateur.",
          );
        }
        return false;
      }
    } catch (error) {
      console.error("[Notif] error in enableNotifications:", error);
      toast.error("Erreur lors de l'activation des notifications.");
      return false;
    }
  }, [saveToken]);

  return {
    permissionStatus,
    enableNotifications,
    isSupported: permissionStatus !== "unsupported",
    isGranted: permissionStatus === "granted",
    isDenied: permissionStatus === "denied",
    isDefault: permissionStatus === "default",
  };
}
