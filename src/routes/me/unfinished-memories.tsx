import Header from "@/components/nav/Header";
import { createFileRoute, useRouter } from "@tanstack/react-router";

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
