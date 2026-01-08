import { createFileRoute } from "@tanstack/react-router";
import Header from "@/components/nav/Header";
import { useState } from "react";

import MemoryTypeSelector from "@/components/nav/MemoryTypeSelector";
import MomentCreationScreen from "@/components/memory-edition/MomentCreationScreen";
import PersonCreationScreen from "@/components/memory-edition/PersonCreationScreen";
import PlaceCreationScreen from "@/components/memory-edition/PlaceCreationScreen";
import ThingCreationScreen from "@/components/memory-edition/ThingCreationScreen";

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

      {memoryType === "moment" && <MomentCreationScreen />}
      {memoryType === "person" && <PersonCreationScreen />}
      {memoryType === "place" && <PlaceCreationScreen />}
      {memoryType === "thing" && <ThingCreationScreen />}
    </div>
  );
}
