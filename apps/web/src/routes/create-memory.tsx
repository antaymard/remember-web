import { createFileRoute } from "@tanstack/react-router";
import Header from "@/components/nav/Header";
import { useState } from "react";

import MemoryTypeSelector from "@/components/nav/MemoryTypeSelector";
import MomentEditionScreen from "@/components/memory-edition/MomentEditionScreen";
import PersonCreationScreen from "@/components/memory-edition/PersonEditionScreen";
import PlaceCreationScreen from "@/components/memory-edition/PlaceEditionScreen";
import ThingCreationScreen from "@/components/memory-edition/ThingEditionScreen";

export const Route = createFileRoute("/create-memory")({
  component: RouteComponent,
});

function RouteComponent() {
  const [memoryType, setMemoryType] = useState<
    "moment" | "place" | "person" | "thing"
  >("moment");

  return (
    <div>
      <Header
        title="Créer"
        rightContent={
          <MemoryTypeSelector
            memoryType={memoryType}
            setMemoryType={setMemoryType}
          />
        }
      />

      {memoryType === "moment" && <MomentEditionScreen action="create" />}
      {memoryType === "person" && <PersonCreationScreen action="create" />}
      {memoryType === "place" && <PlaceCreationScreen action="create" />}
      {memoryType === "thing" && <ThingCreationScreen action="create" />}
    </div>
  );
}
