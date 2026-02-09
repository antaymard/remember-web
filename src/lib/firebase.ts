import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
  type Messaging,
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

let messagingInstance: Messaging | null = null;

async function getMessagingInstance(): Promise<Messaging | null> {
  if (messagingInstance) return messagingInstance;
  const supported = await isSupported();
  if (!supported) {
    console.warn("Firebase Messaging is not supported in this browser.");
    return null;
  }
  messagingInstance = getMessaging(app);
  return messagingInstance;
}

/**
 * Demande la permission de notification et retourne le token FCM.
 * Retourne null si la permission est refusée ou en cas d'erreur.
 */
export async function requestNotificationPermission(): Promise<string | null> {
  try {
    console.log("[Firebase] Requesting permission...");
    const permission = await Notification.requestPermission();
    console.log("[Firebase] Permission result:", permission);
    if (permission !== "granted") {
      console.warn("Notification permission denied");
      return null;
    }

    const messaging = await getMessagingInstance();
    console.log("[Firebase] Messaging instance:", !!messaging);
    if (!messaging) return null;

    // Enregistrer le Service Worker manuellement (comme recommandé dans la doc VitePWA)
    // Dev : /dev-sw.js?dev-sw (type: module pour imports ES6)
    // Prod : /sw.js (type: classic après build VitePWA)
    console.log("[Firebase] Registering SW...");
    const isDev = import.meta.env.DEV;
    const swPath = isDev ? "/dev-sw.js?dev-sw" : "/sw.js";
    const swType = isDev ? "module" : "classic";

    if (!("serviceWorker" in navigator)) {
      console.error("Service Worker not supported");
      return null;
    }

    const swRegistration = await navigator.serviceWorker.register(swPath, {
      type: swType,
      scope: "/",
    });
    console.log("[Firebase] SW registered:", swRegistration.scope, "type:", swType);

    // Attendre que le SW soit actif avant d'appeler getToken
    if (!swRegistration.active) {
      console.log("[Firebase] Waiting for SW to activate...");
      const sw = swRegistration.installing || swRegistration.waiting;
      if (sw) {
        await new Promise<void>((resolve) => {
          sw.addEventListener("statechange", () => {
            if (sw.state === "activated") resolve();
          });
        });
      }
      console.log("[Firebase] SW now active");
    }

    console.log("[Firebase] Getting token...");
    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
    console.log("[Firebase] VAPID key loaded:", vapidKey ? "YES (length: " + vapidKey.length + ")" : "NO - MISSING!");

    // Passer l'enregistrement du SW à Firebase (clé de la solution)
    const token = await getToken(messaging, {
      vapidKey: vapidKey,
      serviceWorkerRegistration: swRegistration,
    });
    console.log(
      "[Firebase] Token received:",
      token ? token.slice(0, 20) + "..." : null,
    );
    return token;
  } catch (error) {
    console.error("Error getting notification permission:", error);
    return null;
  }
}

/**
 * Retourne le statut actuel de la permission de notification.
 */
export function getNotificationPermissionStatus():
  | NotificationPermission
  | "unsupported" {
  if (!("Notification" in window)) return "unsupported";
  return Notification.permission;
}

/**
 * Écoute les messages push reçus en foreground (app ouverte).
 */
export function onForegroundMessage(
  callback: (payload: {
    notification?: { title?: string; body?: string };
  }) => void,
): () => void {
  let unsubscribe: (() => void) | null = null;

  getMessagingInstance().then((messaging) => {
    if (messaging) {
      unsubscribe = onMessage(messaging, callback);
    }
  });

  return () => {
    unsubscribe?.();
  };
}
