import { ConvexError } from "convex/values";
import type { ActionCtx, MutationCtx, QueryCtx } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import type { Id } from "../_generated/dataModel";

// Function overloads pour typage précis
export async function requireAuth(
  ctx: MutationCtx | QueryCtx | ActionCtx,
  throwError: true
): Promise<Id<"users">>;
export async function requireAuth(
  ctx: MutationCtx | QueryCtx | ActionCtx,
  throwError?: false
): Promise<Id<"users"> | null>;

// Pour les mutations - throw si non authentifié (catch côté front)
export async function requireAuth(
  ctx: MutationCtx | QueryCtx | ActionCtx,
  throwError: boolean = false
): Promise<Id<"users"> | null> {
  const userId = await getAuthUserId(ctx);

  if (!userId) {
    if (throwError) throw new ConvexError("Utilisateur non authentifié");
    return null;
  }

  return userId;
}
