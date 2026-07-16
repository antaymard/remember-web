import { useQuery } from "convex-helpers/react/cache/hooks";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";

interface UserContextValue {
  user: Doc<"users"> | null | undefined;
  unfinishedMemoriesCount: number | undefined;
}

/**
 * Hook pour accéder aux données de l'utilisateur connecté
 * Utilise le cache Convex global - pas besoin de Provider
 */
export function useUser(): UserContextValue {
  const result = useQuery(api.users.getMe);
  return {
    user: result?.user,
    unfinishedMemoriesCount: result?.unfinishedMemoriesCount,
  };
}
