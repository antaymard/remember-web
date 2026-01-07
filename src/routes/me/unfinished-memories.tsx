import Header from "@/components/nav/Header";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { api } from "@/../convex/_generated/api";
import { useQuery } from "node_modules/convex/dist/esm-types/react/client";

export const Route = createFileRoute("/me/unfinished-memories")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();

  return (
    <>
      <Header
        title="Souvenirs à terminer"
        showBackArrow
        onArrowBackClick={() => router.history.back()}
      />
    </>
  );
}
