"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import * as crypto from "crypto";

// ─── OAuth2 Access Token ────────────────────────────────────────────────────

let cachedToken: { token: string; expiry: number } | null = null;

/**
 * Génère un access token OAuth2 à partir du service account Firebase.
 * Le token est mis en cache et renouvelé automatiquement.
 */
async function getAccessToken(): Promise<string> {
  // Retourner le token en cache s'il est encore valide (marge de 5 min)
  if (cachedToken && cachedToken.expiry > Date.now() + 5 * 60 * 1000) {
    return cachedToken.token;
  }

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT is not configured");
  }
  const serviceAccount = JSON.parse(raw);

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: serviceAccount.client_email,
    scope: "https://www.googleapis.com/auth/firebase.messaging",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };

  const base64url = (obj: object) =>
    Buffer.from(JSON.stringify(obj)).toString("base64url");

  const unsignedJwt = `${base64url(header)}.${base64url(payload)}`;

  const sign = crypto.createSign("RSA-SHA256");
  sign.update(unsignedJwt);
  const signature = sign.sign(serviceAccount.private_key, "base64url");

  const jwt = `${unsignedJwt}.${signature}`;

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!response.ok) {
    throw new Error(`OAuth2 token request failed: ${await response.text()}`);
  }

  const data = await response.json();
  cachedToken = {
    token: data.access_token,
    expiry: Date.now() + data.expires_in * 1000,
  };

  return data.access_token;
}

// ─── FCM v1 API ─────────────────────────────────────────────────────────────

const FCM_PROJECT_ID = "remember-248c6";

/**
 * Envoie une notification push à un device spécifique via FCM v1 API.
 * Supprime automatiquement le token si le device n'est plus enregistré.
 */
export const sendToDevice = internalAction({
  args: {
    fcmToken: v.string(),
    title: v.string(),
    body: v.string(),
    data: v.optional(v.any()),
  },
  handler: async (ctx, args): Promise<{ success: boolean; error?: string }> => {
    const accessToken = await getAccessToken();

    const response = await fetch(
      `https://fcm.googleapis.com/v1/projects/${FCM_PROJECT_ID}/messages:send`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          message: {
            token: args.fcmToken,
            notification: {
              title: args.title,
              body: args.body,
            },
            data: args.data,
          },
        }),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("FCM request failed:", error);

      // Nettoyer les tokens invalides
      if (
        error.includes("UNREGISTERED") ||
        error.includes("INVALID_ARGUMENT")
      ) {
        console.warn(
          `Removing invalid FCM token: ${args.fcmToken.slice(0, 10)}...`,
        );
        await ctx.runMutation(internal.pushSubscriptions.removeTokenInternal, {
          fcmToken: args.fcmToken,
        });
      }

      return { success: false, error };
    }

    return { success: true };
  },
});

/**
 * Envoie une notification push à tous les devices d'un utilisateur.
 * Retourne le nombre de notifications envoyées et échouées.
 */
export const sendToUser = internalAction({
  args: {
    userId: v.id("users"),
    title: v.string(),
    body: v.string(),
    data: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const subscriptions = await ctx.runQuery(
      internal.pushSubscriptions.getByUserInternal,
      { userId: args.userId },
    );

    if (subscriptions.length === 0) {
      console.warn(`No push subscriptions found for user ${args.userId}`);
      return { sent: 0, failed: 0 };
    }

    let sent = 0;
    let failed = 0;

    for (const sub of subscriptions) {
      const result = await ctx.runAction(internal.notifications.sendToDevice, {
        fcmToken: sub.fcmToken,
        title: args.title,
        body: args.body,
        data: args.data,
      });

      if (result.success) {
        sent++;
      } else {
        failed++;
      }
    }

    return { sent, failed };
  },
});
