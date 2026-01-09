import { createFileRoute } from "@tanstack/react-router";
import Header from "@/components/nav/Header";
import MomentCreationScreen from "@/components/memory-edition/MomentEditionScreen";
import PersonCreationScreen from "@/components/memory-edition/PersonEditionScreen";
import PlaceCreationScreen from "@/components/memory-edition/PlaceEditionScreen";
import ThingCreationScreen from "@/components/memory-edition/ThingEditionScreen";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import type { Id } from "@/../convex/_generated/dataModel";
import type { MomentType, PersonType } from "@/types/memory.types";

export const Route = createFileRoute("/edit-memory/$type/$_id")({
  component: RouteComponent,
});

function RouteComponent() {
  const memoryType = Route.useParams().type as
    | "moment"
    | "place"
    | "person"
    | "thing";

  const memoryId = Route.useParams()._id as
    | Id<"moments">
    | Id<"persons">
    | Id<"places">
    | Id<"things">;

  const data = useQuery(api.memories.read, {
    _id: memoryId,
    type: memoryType,
  });

  if (data === undefined) return <div>Chargement...</div>;
  if (data === null)
    return <div>Un problème est survenu ou la mémoire n'existe pas.</div>;

  const { memory } = data;

  return (
    <div>
      <Header title="Modifier" showBackArrow />

      {memoryType === "moment" && (
        <MomentCreationScreen
          defaultValues={memory as MomentType}
          action="edit"
          memoryId={memoryId as Id<"moments">}
        />
      )}
      {memoryType === "person" && (
        <PersonCreationScreen
          action="edit"
          defaultValues={memory as PersonType}
          memoryId={memoryId as Id<"persons">}
        />
      )}
      {memoryType === "place" && (
        <PlaceCreationScreen
          action="edit"
          memoryId={memoryId as Id<"places">}
        />
      )}
      {memoryType === "thing" && (
        <ThingCreationScreen
          action="edit"
          memoryId={memoryId as Id<"things">}
        />
      )}
    </div>
  );
}
