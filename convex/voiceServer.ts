import { query } from "./_generated/server";
import { requireAuth } from "./utils/requireAuth";

// Renvoie la config de connexion au voice-server (URL + token) aux
// utilisateurs authentifiés uniquement.
//
// Pourquoi passer par le backend ? Le token n'est PAS embarqué en dur dans
// le bundle front : il reste dans les variables d'env Convex (hors repo) et
// n'est servi qu'aux users connectés. Le flux audio temps réel, lui, ne
// passe PAS par Convex (une query/mutation est du request/response, pas du
// full-duplex) : le navigateur ouvre un WebSocket directement vers le
// voice-server une fois la config récupérée.
//
// Config requise (déploiement Convex) :
//   npx convex env set VOICE_SERVER_URL   https://voice.exemple.com
//   npx convex env set VOICE_SERVER_TOKEN <AUTH_TOKEN du voice-server>
export const realtimeConfig = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx, false);
    if (!userId) return null;

    const url = process.env.VOICE_SERVER_URL;
    const token = process.env.VOICE_SERVER_TOKEN;
    if (!url || !token) return null;

    return { url, token };
  },
});
