import type { MomentWithCreator, PersonType } from "@/types/memory.types";
import Header from "../nav/Header";
import { useNavigate } from "@tanstack/react-router";
import { ButtonPastel } from "../ui/Button";
import { useUser } from "@/contexts/userContext";
import MediasCarousel from "../ui/MediasCarousel";
import PersonItemCard from "../cards/PersonItemCard";
import type { FlexibleDateTime } from "@/types/shared.types";
import { TbCalendar } from "react-icons/tb";

function renderDate(date: FlexibleDateTime | undefined) {
  if (!date) return null;
  if (!date.day || !date.month || !date.year) return null;
  const time = date.hour && date.min ? `${date.hour}:${date.min}` : "";
  return (
    <div className="flex gap-2 items-center">
      <TbCalendar size={20} />
      {date.day}/{date.month}/{date.year} {time}
    </div>
  );
}

export default function MomentViewScreen({
  moment,
}: {
  moment: MomentWithCreator;
}) {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <div className="bg-bg pt-17.5">
      <Header
        title={moment.title || "Untitled Moment"}
        showBackArrow
        rightContent={
          moment.creator_id === user?._id && (
            <ButtonPastel
              icon="pen"
              color="green"
              onClick={() =>
                navigate({
                  to: "/edit-memory/$type/$_id",
                  params: {
                    type: "moment",
                    _id: moment._id!,
                  },
                })
              }
            />
          )
        }
      />
      <MediasCarousel medias={moment.medias || []} aspectSquare />
      <div className="space-y-2.5">
        <Section title="Description">
          {moment.description ? (
            <p className="whitespace-pre-wrap">{moment.description}</p>
          ) : (
            <p className="opacity-60">Aucune description disponible.</p>
          )}
        </Section>
        <Section title="Date et lieu">
          {renderDate(moment.date_time_in)}
        </Section>
        <Section title="Personnes présentes">
          {moment.present_persons && moment?.present_persons?.length > 0 ? (
            moment.present_persons.map((person: PersonType) => (
              <PersonItemCard key={person._id} person={person} />
            ))
          ) : (
            <p className="opacity-60">
              Aucune personne n'est associée à ce moment.
            </p>
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
