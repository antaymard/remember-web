import Header from "@/components/nav/Header";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { api } from "@/../convex/_generated/api";
import { useQuery } from "convex/react";
import { TbChevronRight } from "react-icons/tb";
import MemoryTypeIndicator from "@/components/cards/MemoryTypeIndicator";
import type { MemoryType } from "@/types/shared.types";

export const Route = createFileRoute("/me/unfinished-memories")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();

  const memories = useQuery(api.memories.list, {
    type: ["moment", "person", "thing", "place"],
    filter: { status: "unfinished" },
  });

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
        {memories.length === 0 ? (
          <div className="p-4">Aucun souvenir inachevé.</div>
        ) : (
          memories.map((memory) => (
            <UnfinishedMemoryCard key={memory._id} memory={memory} />
          ))
        )}
      </div>
    </>
  );
}

function UnfinishedMemoryCard({ memory }: { memory: any }) {
  const memoryType = memory._memory_type as MemoryType;

  // Construire le label selon le type
  const label =
    memoryType === "person"
      ? `${memory.firstname} ${memory.lastname}`
      : memory.title || "Sans titre";

  return (
    <Link
      to="/edit-memory/$type/$_id"
      params={{
        type: memoryType,
        _id: memory._id,
      }}
    >
      <div className="p-4 flex items-center justify-between gap-3">
        <p className="flex-1">{label}</p>
        <MemoryTypeIndicator memoryType={memoryType} />
        <TbChevronRight size={20} />
      </div>
    </Link>
  );
}
