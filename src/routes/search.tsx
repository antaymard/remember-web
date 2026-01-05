import Header from "@/components/nav/Header";
import Navbar from "@/components/nav/Navbar";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/search")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Header title="Search" />
      <div className="py-17.5"></div>
      <Navbar />
    </div>
  );
}
