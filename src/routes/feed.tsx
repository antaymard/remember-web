import Header from "@/components/nav/Header";
import Navbar from "@/components/nav/Navbar";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import MomentMemoryCard from "@/components/cards/MomentMemoryCard";
import type { MomentWithCreator } from "@/types/memory.types";
import PersonMemoryCard from "@/components/cards/PersonMemoryCard";

export const Route = createFileRoute("/feed")({
  component: RouteComponent,
});

function RouteComponent() {
  const memories = useQuery(api.memories.list, {
    type: ["moment", "person"],
    populate: "creator_id present_persons",
  });

  return (
    <div>
      <Header title="Feed" />
      <div className="py-17.5 flex flex-col gap-2.5 bg-bg">
        {memories && memories.length > 0 ? (
          memories.map((memory) => {
            if (memory._memory_type === "moment")
              return (
                <MomentMemoryCard
                  key={memory._id}
                  moment={memory as MomentWithCreator}
                />
              );
            if (memory._memory_type === "person")
              return <PersonMemoryCard key={memory._id} person={memory} />;
          })
        ) : (
          <div>Aucun souvenir à afficher</div>
        )}
      </div>
      <Navbar />
    </div>
  );
}
