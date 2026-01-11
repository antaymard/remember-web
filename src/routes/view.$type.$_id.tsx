import MomentViewScreen from "@/components/memory-view/MomentViewScreen";
import { createFileRoute, useRouterState } from "@tanstack/react-router";
import { api } from "@/../convex/_generated/api";
import { useQuery } from "convex/react";
import type {
  MomentWithCreator,
  PersonWithCreator,
} from "@/types/memory.types";
import type { Id } from "@/../convex/_generated/dataModel";
import PersonViewScreen from "@/components/memory-view/PersonViewScreen";

export const Route = createFileRoute("/view/$type/$_id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { type, _id } = Route.useParams();
  const routerState = useRouterState();

  // Récupérer les données optimistes du state (depuis le feed)
  const optimisticData = routerState.location.state?.optimisticData as
    | MomentWithCreator
    | PersonWithCreator
    | undefined;

  // Lancer la query en parallèle pour avoir des données fraîches
  const data = useQuery(api.memories.read, {
    type: type as "moment" | "person" | "thing" | "place",
    _id: _id as Id<"moments"> | Id<"persons"> | Id<"things"> | Id<"places">,
    populate: "creator present_persons",
  });

  // Utiliser les données optimistes en attendant la query
  const memory = data?.memory ?? optimisticData;

  if (!memory) {
    return <div>Loading...</div>;
  }

  switch (type) {
    case "moment": {
      return <MomentViewScreen moment={memory as MomentWithCreator} />;
    }
    case "person": {
      return <PersonViewScreen person={memory as PersonWithCreator} />;
    }
    case "place":
      return <div>Place View for ID: {_id}</div>;
    case "thing":
      return <div>Thing View for ID: {_id}</div>;
    default:
      return <div>Unknown type: {type}</div>;
  }
}
