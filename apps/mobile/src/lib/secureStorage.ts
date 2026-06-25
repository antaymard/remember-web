import * as SecureStore from "expo-secure-store";

// Storage adapter for @convex-dev/auth backed by expo-secure-store.
//
// SecureStore keys may only contain [A-Za-z0-9._-]; Convex Auth derives keys
// from the deployment URL (which contains ":" and "/"), so we sanitize them.
// Values are JWTs/refresh tokens, comfortably under SecureStore's size limit.
function safeKey(key: string): string {
  return key.replace(/[^A-Za-z0-9._-]/g, "_");
}

export const secureStorage = {
  getItem: (key: string) => SecureStore.getItemAsync(safeKey(key)),
  setItem: (key: string, value: string) =>
    SecureStore.setItemAsync(safeKey(key), value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(safeKey(key)),
};
