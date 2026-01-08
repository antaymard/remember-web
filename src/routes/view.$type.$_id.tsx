import MomentViewScreen from "@/components/memory-view/MomentViewScreen";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "@/../convex/_generated/api";
import { useQuery } from "convex/react";

export const Route = createFileRoute("/view/$type/$_id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { type, _id } = Route.useParams();

  const { memory }: { memory: any } =
    useQuery(api.memories.read, { type, _id }) || {};

  if (!memory) {
    return <div>Loading...</div>;
  }

  switch (type) {
    case "moment":
      return <MomentViewScreen moment={memory} />;
    case "person":
      return <div>Person View for ID: {_id}</div>;
    case "place":
      return <div>Place View for ID: {_id}</div>;
    case "thing":
      return <div>Thing View for ID: {_id}</div>;
    default:
      return <div>Unknown type: {type}</div>;
  }
}
