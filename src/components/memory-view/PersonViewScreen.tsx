import Header from "@/components/nav/Header";
import { useUser } from "@/contexts/userContext";
import type { PersonWithCreator } from "@/types/memory.types";
import { useNavigate } from "@tanstack/react-router";
import { ButtonPastel } from "../ui/Button";
import MediasCarousel from "../ui/MediasCarousel";
import { formatFlexibleDate } from "@/utils/formatDate";

function getGenderLabel(gender: string | undefined) {
  if (gender === "male") return "Masculin";
  if (gender === "female") return "Féminin";
  return null;
}

function getTypeLabel(type: "animal" | "human") {
  return type === "human" ? "Humain" : "Animal";
}

function getRelationTypeLabel(relationType: string | undefined) {
  const labels: Record<string, string> = {
    family: "Famille",
    friend: "Ami",
    colleague: "Collègue",
    acquaintance: "Connaissance",
    teacher: "Enseignant / Mentor",
    other: "Autre",
  };
  return relationType ? labels[relationType] : null;
}

export default function PersonViewScreen({
  person,
}: {
  person: PersonWithCreator;
}) {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <div className="bg-bg pt-17.5">
      <Header
        title={
          person?.firstname || person?.lastname
            ? `${person.firstname} ${person.lastname}`
            : "Personne sans nom"
        }
        showBackArrow
        rightContent={
          person.creator_id === user?._id && (
            <ButtonPastel
              icon="pen"
              color="green"
              onClick={() =>
                navigate({
                  to: "/edit-memory/$type/$_id",
                  params: {
                    type: "person",
                    _id: person._id!,
                  },
                })
              }
            />
          )
        }
      />

      <MediasCarousel medias={person.medias || []} aspectSquare />
      <div className="space-y-2.5">
        <Section title="Général">
          <div className="space-y-1">
            <p>
              <strong>Type :</strong> {getTypeLabel(person.type)}
            </p>
            {person.gender && (
              <p>
                <strong>Genre :</strong> {getGenderLabel(person.gender)}
              </p>
            )}
          </div>
        </Section>

        <Section title="Lien">
          {person.relation_type && (
            <p>
              <strong>Type de relation :</strong>{" "}
              {getRelationTypeLabel(person.relation_type)}
            </p>
          )}
          {person.relation_name && (
            <p>
              <strong>Lien précis :</strong> {person.relation_name}
            </p>
          )}
          {person.description ? (
            <p className="whitespace-pre-wrap">{person.description}</p>
          ) : (
            <p className="opacity-60">Aucune description disponible.</p>
          )}
        </Section>

        <Section title="Temporel">
          <div className="space-y-1">
            {formatFlexibleDate(person.birth_date) && (
              <p>
                <strong>Naissance :</strong> {formatFlexibleDate(person.birth_date)}
              </p>
            )}
            {formatFlexibleDate(person.death_date) && (
              <p>
                <strong>Décès :</strong> {formatFlexibleDate(person.death_date)}
              </p>
            )}
            {formatFlexibleDate(person.first_met) && (
              <p>
                <strong>Rencontre :</strong> {formatFlexibleDate(person.first_met)}
              </p>
            )}
            {formatFlexibleDate(person.last_seen) && (
              <p>
                <strong>Dernier contact :</strong>{" "}
                {formatFlexibleDate(person.last_seen)}
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
