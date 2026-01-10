import FriendPicker from "@/components/form/FriendPicker";
import Header from "@/components/nav/Header";
import Navbar from "@/components/nav/Navbar";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/friends")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Header title="Amis" />
      <div className="py-17.5 px-4">
        <FriendPicker />
      </div>
      <Navbar />
    </div>
  );
}
