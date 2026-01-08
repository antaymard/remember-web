import MomentViewScreen from "@/components/memory-view/MomentViewScreen";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "@/../convex/_generated/api";
import { useQuery } from "convex/react";
import type { MomentWithCreator } from "@/types/memory.types";
import type { Id } from "@/../convex/_generated/dataModel";

export const Route = createFileRoute("/view/$type/$_id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { type, _id } = Route.useParams();

  const data = useQuery(api.memories.read, {
    type: type as "moment" | "person" | "thing" | "place",
    _id: _id as Id<"moments"> | Id<"persons"> | Id<"things"> | Id<"places">,
    populate: "creator present_persons",
  });

  if (!data) {
    return <div>Loading...</div>;
  }

  switch (type) {
    case "moment": {
      const { memory } = data;
      return <MomentViewScreen moment={memory as MomentWithCreator} />;
    }
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
