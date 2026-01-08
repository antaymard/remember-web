import Header from "@/components/nav/Header";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { api } from "@/../convex/_generated/api";
import { useQuery } from "convex/react";
import { TbChevronRight } from "react-icons/tb";

export const Route = createFileRoute("/me/unfinished-memories")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();

  const memories = useQuery(api.memories.listUnfinished);

  if (!memories) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header
        title="Souvenirs à terminer"
        showBackArrow
        onArrowBackClick={() => router.history.back()}
      />
      <div className="pt-17.5">
        {memories?.moments.length === 0 ? (
          <div className="p-4">Aucun souvenir inachevé.</div>
        ) : (
          memories.moments.map((memory) => (
            <UnfinishedMemoryCard key={memory._id} memory={memory} />
          ))
        )}
      </div>
    </>
  );
}

function UnfinishedMemoryCard({ memory }: { memory: any }) {
  return (
    <Link
      to="/edit-memory/$type/$_id"
      params={{
        type: "moment",
        _id: memory._id,
      }}
    >
      <div className="p-4 flex items-center justify-between">
        <p>{memory.title || "Untitled Moment"}</p>
        <TbChevronRight size={20} />
      </div>
    </Link>
  );
}
