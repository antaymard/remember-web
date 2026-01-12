import Header from "@/components/nav/Header";
import { useUser } from "@/contexts/userContext";
import type { PlaceWithCreator } from "@/types/memory.types";
import { useNavigate } from "@tanstack/react-router";
import { ButtonPastel } from "../ui/Button";
import MediasCarousel from "../ui/MediasCarousel";

export default function PlaceViewScreen({
  place,
}: {
  place: PlaceWithCreator;
}) {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <div className="bg-bg pt-17.5">
      <Header
        title={place?.title || "Lieu sans nom"}
        showBackArrow
        rightContent={
          place.creator_id === user?._id && (
            <ButtonPastel
              icon="pen"
              color="green"
              onClick={() =>
                navigate({ to: `/edit-memory/place/${place._id}` })
              }
            />
          )
        }
      />

      <MediasCarousel medias={place.medias || []} aspectSquare />
      <div className="space-y-2.5">
        <Section title="Description">
          {place.description ? (
            <p className="whitespace-pre-wrap">{place.description}</p>
          ) : (
            <p className="opacity-60">Aucune description disponible.</p>
          )}
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2 p-4 bg-white">
      <h3>{title}</h3>
      {children}
    </div>
  );
}
