import type { FunctionReference } from "convex/server";
import { type OptionalRestArgsOrSkip, useConvexAuth } from "convex/react";

import { makeUseQueryWithStatus } from "convex-helpers/react";
import { useQueries } from "convex/react";

export const useQueryWithStatus = makeUseQueryWithStatus(useQueries);

/**
 * A wrapper around useQueryWithStatus that automatically checks authentication state.
 * If the user is not authenticated, the query is skipped.
 */
export function useAuthenticatedQueryWithStatus<
  Query extends FunctionReference<"query">,
>(query: Query, args: OptionalRestArgsOrSkip<Query>[0] | "skip") {
  const { isAuthenticated } = useConvexAuth();
  return useQueryWithStatus(query, isAuthenticated ? args : "skip");
}
