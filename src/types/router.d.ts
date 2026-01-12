import "@tanstack/react-router";
import type {
  MomentWithCreator,
  PersonWithCreator,
  PlaceWithCreator,
  ThingWithCreator,
} from "./memory.types";

declare module "@tanstack/react-router" {
  interface HistoryState {
    optimisticData?:
      | MomentWithCreator
      | PersonWithCreator
      | PlaceWithCreator
      | ThingWithCreator
      | Record<string, unknown>;
  }
}
