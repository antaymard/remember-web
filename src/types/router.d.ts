import "@tanstack/react-router";
import type {
  MomentWithCreator,
  PersonWithCreator,
  PlaceWithCreator,
} from "./memory.types";

declare module "@tanstack/react-router" {
  interface HistoryState {
    optimisticData?:
      | MomentWithCreator
      | PersonWithCreator
      | PlaceWithCreator
      | Record<string, unknown>;
  }
}
