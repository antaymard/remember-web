import Header from "@/components/nav/Header";
import Navbar from "@/components/nav/Navbar";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import MomentCard from "@/components/cards/MomentCard";
import type { MomentWithCreator } from "@/types/memory.types";

export const Route = createFileRoute("/feed")({
  component: RouteComponent,
});

function RouteComponent() {
  const moments = useQuery(api.moments.list);

  return (
    <div>
      <Header title="Feed" />
      <div className="py-17.5 flex flex-col gap-2.5 bg-bg">
        {moments && moments.length > 0 ? (
          moments.map((moment) => (
            <div key={moment._id} className="">
              <MomentCard moment={moment as MomentWithCreator} />
            </div>
          ))
        ) : (
          <div>Aucun souvenir à afficher</div>
        )}
      </div>
      <Navbar />
    </div>
  );
}
