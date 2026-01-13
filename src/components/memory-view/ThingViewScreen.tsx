import Header from "@/components/nav/Header";
import { useUser } from "@/contexts/userContext";
import type { ThingWithCreator } from "@/types/memory.types";
import { useNavigate } from "@tanstack/react-router";
import { ButtonPastel } from "../ui/Button";
import MediasCarousel from "../ui/MediasCarousel";
import type { FlexibleDateTime } from "@/types/shared.types";

function renderDate(date: FlexibleDateTime | undefined) {
  if (!date) return null;
  if (!date.day || !date.month || !date.year) return null;
  return `${date.day}/${date.month}/${date.year}`;
}

function getTypeLabel(type: string | undefined) {
  const labels: Record<string, string> = {
    physical: "Objet physique",
    music: "Musique",
    film: "Film",
    book: "Livre",
    game: "Jeu",
    interest: "Centre d'intérêt",
    personality: "Personnalité",
  };
  return type ? labels[type] : "Non spécifié";
}

export default function ThingViewScreen({
  thing,
}: {
  thing: ThingWithCreator;
}) {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <div className="bg-bg pt-17.5">
      <Header
        title={thing?.title || "Chose sans nom"}
        showBackArrow
        rightContent={
          thing.creator_id === user?._id && (
            <ButtonPastel
              icon="pen"
              color="green"
              onClick={() =>
                navigate({
                  to: "/edit-memory/$type/$_id",
                  params: {
                    type: "thing",
                    _id: thing._id!,
                  },
                })
              }
            />
          )
        }
      />

      <MediasCarousel medias={thing.medias || []} aspectSquare />
      <div className="space-y-2.5">
        <Section title="Type">
          <p>
            <strong>Catégorie :</strong> {getTypeLabel(thing.type)}
          </p>
        </Section>

        <Section title="Description">
          {thing.description ? (
            <p className="whitespace-pre-wrap">{thing.description}</p>
          ) : (
            <p className="opacity-60">Aucune description disponible.</p>
          )}
        </Section>

        <Section title="Temporel">
          <div className="space-y-1">
            {renderDate(thing.first_met) && (
              <p>
                <strong>Premier contact / Acquisition :</strong>{" "}
                {renderDate(thing.first_met)}
              </p>
            )}
            {renderDate(thing.last_seen) && (
              <p>
                <strong>Dernier contact :</strong>{" "}
                {renderDate(thing.last_seen)}
              </p>
            )}
          </div>
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
