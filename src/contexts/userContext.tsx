import { useQuery } from "convex/react";
import { createContext, useContext, type ReactNode } from "react";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";

interface UserContextValue {
  user: Doc<"users"> | null | undefined;
  unfinishedMemoriesCount: number | undefined;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const result = useQuery(api.users.getMe);
  const value: UserContextValue = {
    user: result?.user,
    unfinishedMemoriesCount: result?.unfinishedMemoriesCount,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
