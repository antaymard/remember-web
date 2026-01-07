import { createFileRoute } from "@tanstack/react-router";
import Header from "@/components/nav/Header";
import { useState } from "react";

import MemoryTypeSelector from "@/components/nav/MemoryTypeSelector";
import MomentCreationScreen from "@/components/creation-screens/MomentCreationScreen";
import PersonCreationScreen from "@/components/creation-screens/PersonCreationScreen";
import PlaceCreationScreen from "@/components/creation-screens/PlaceCreationScreen";
import ThingCreationScreen from "@/components/creation-screens/ThingCreationScreen";

export const Route = createFileRoute("/create-memory")({
  component: RouteComponent,
});


function RouteComponent() {

  const [memoryType, setMemoryType] = useState<
    "moment" | "place" | "person" | "thing"
  >("place");



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
