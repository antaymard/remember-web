import { createFileRoute } from "@tanstack/react-router";
import Header from "@/components/nav/Header";
import MomentCreationScreen from "@/components/memory-edition/MomentCreationScreen";
import PersonCreationScreen from "@/components/memory-edition/PersonCreationScreen";
import PlaceCreationScreen from "@/components/memory-edition/PlaceCreationScreen";
import ThingCreationScreen from "@/components/memory-edition/ThingCreationScreen";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import type { Id } from "@/../convex/_generated/dataModel";
import type { MomentType } from "@/types/memory.types";

export const Route = createFileRoute("/edit-memory/$type/$_id")({
  component: RouteComponent,
});

function RouteComponent() {
  const memoryType = Route.useParams().type as
    | "moment"
    | "place"
    | "person"
    | "thing";

  const data = useQuery(api.memories.read, {
    _id: Route.useParams()._id as
      | Id<"moments">
      | Id<"persons">
      | Id<"places">
      | Id<"things">,
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
          submitLabel="Modifier"
        />
      )}
      {memoryType === "person" && <PersonCreationScreen />}
      {memoryType === "place" && <PlaceCreationScreen />}
      {memoryType === "thing" && <ThingCreationScreen />}
    </div>
  );
}
