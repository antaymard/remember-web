import { ConvexReactClient } from "convex/react";

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  throw new Error(
    "Missing EXPO_PUBLIC_CONVEX_URL. Copy apps/mobile/.env.example to apps/mobile/.env " +
      "and set it to your Convex deployment URL."
  );
}

// `unsavedChangesWarning` is a web-only feature; disable it on React Native.
export const convex = new ConvexReactClient(convexUrl, {
  unsavedChangesWarning: false,
});
