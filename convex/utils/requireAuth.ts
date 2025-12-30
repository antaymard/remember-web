import { ConvexError } from "convex/values";
import type { ActionCtx, MutationCtx, QueryCtx } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Pour les mutations - throw si non authentifié (catch côté front)
export async function requireAuth(
  ctx: MutationCtx | QueryCtx | ActionCtx,
  throwError: boolean = false
) {
  const userId = await getAuthUserId(ctx);

  if (!userId) {
    if (throwError) throw new ConvexError("Utilisateur non authentifié");
    return null;
  }

  return userId;
}
