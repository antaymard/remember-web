import type { PersonType } from "@/types/memory.types";
import OptimizedImage from "@/components/ui/OptimizedImage";

export default function PersonCard({ person }: { person: PersonType }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {person.medias?.[0] ? (
          <OptimizedImage
            media={person.medias[0]}
            size="sm"
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200" />
        )}
        <p className="font-medium">{`${person.firstname} ${person.lastname}`}</p>
      </div>
    </div>
  );
}
