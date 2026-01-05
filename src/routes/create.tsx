import ImageUploader from "@/components/form/ImageUploader";
import CreationNavbar from "@/components/nav/CreationNavbar";
import Header from "@/components/nav/Header";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/create")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Header title="Créer" />
      <div className="py-17.5 bg-bg min-h-screen">
        <ImageUploader />
      </div>
      <CreationNavbar />
    </div>
  );
}
