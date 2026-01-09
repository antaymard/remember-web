import Header from "@/components/nav/Header";
import { useUser } from "@/contexts/userContext";
import type { PersonWithCreator } from "@/types/memory.types";
import { useNavigate } from "@tanstack/react-router";
import { ButtonPastel } from "../ui/Button";

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
                navigate({ to: `/edit-memory/person/${person._id}` })
              }
            />
          )
        }
      />
    </div>
  );
}
