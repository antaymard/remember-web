import type { PersonType } from "@/types/memory.types";

export default function PersonCard({ person }: { person: PersonType }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img
          src={person.medias?.[0]?.url}
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <p className="font-medium">{`${person.firstname} ${person.lastname}`}</p>
      </div>
    </div>
  );
}
