import "@tanstack/react-router";
import type { MomentWithCreator, PersonWithCreator } from "./memory.types";

declare module "@tanstack/react-router" {
  interface HistoryState {
    optimisticData?:
      | MomentWithCreator
      | PersonWithCreator
      | Record<string, unknown>;
  }
}
