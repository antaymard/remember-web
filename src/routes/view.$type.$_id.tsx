import MomentViewScreen from "@/components/memory-view/MomentViewScreen";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/view/$type/$_id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { type, _id } = Route.useParams();

  switch (type) {
    case "moment":
      return <MomentViewScreen />;
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
