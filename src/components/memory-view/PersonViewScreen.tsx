import Header from "@/components/nav/Header";
import { useUser } from "@/contexts/userContext";
import type { PersonWithCreator } from "@/types/memory.types";
import type { FlexibleDateTime } from "@/types/shared.types";
import { useNavigate } from "@tanstack/react-router";
import { ButtonPastel } from "../ui/Button";

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

export default function PersonViewScreen({
  person,
}: {
  person: PersonWithCreator;
}) {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <div className="bg-bg">
      <Header
        title={
          `${person?.firstname} ${person?.lastname}` || "Personne sans nom"
        }
        showBackArrow
        rightContent={
          person.creator_id === user?._id && (
            <ButtonPastel
              icon="pen"
              color="green"
              onClick={() =>
                navigate({ to: `/edit-memory/person/${person._id}` })
              }
            />
          )
        }
      />
    </div>
  );
}
