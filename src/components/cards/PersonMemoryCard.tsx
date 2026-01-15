import type { PersonWithCreator } from "@/types/memory.types";
import { Link } from "@tanstack/react-router";
import type { Id } from "@/../convex/_generated/dataModel";
import MediasCarousel from "@/components/ui/MediasCarousel";
import MemoryTypeIndicator from "./MemoryTypeIndicator";
import OptimizedImage from "@/components/ui/OptimizedImage";

export default function PersonMemoryCard({
  person,
}: {
  person: PersonWithCreator;
}) {
  if (!person) return null;

  return (
    <Link
      to="/view/$type/$_id"
      params={{
        type: "person",
        _id: person._id as Id<"persons">,
      }}
      state={{
        optimisticData: person,
      }}
    >
      <div className="bg-white py-4 space-y-3">
        {/* Header */}
        <div className="flex px-4 items-center gap-3 w-full">
          {person.creator?.medias?.[0] && (
            <OptimizedImage
              media={person.creator.medias[0]}
              size="sm"
              className="w-10 h-10 aspect-square rounded-full object-cover"
            />
          )}
          <div className="flex flex-col w-full min-w-0">
            <h2 className="font-serif text-xl leading-tight truncate">
              {person.firstname} {person.lastname}
            </h2>
            <p className="leading-tight opacity-80 text-sm">
              {person.creator?.firstname} {person.creator?.lastname}
            </p>
          </div>
          <MemoryTypeIndicator memoryType="person" />
        </div>
        {person.medias && person.medias.length > 0 && (
          <div className="aspect-square w-full relative">
            <MediasCarousel medias={person.medias} aspectSquare />
          </div>
        )}
        {person.description && (
          <p
            className={`leading-tight opacity-80 px-4 ${
              person.medias && person.medias.length > 0
                ? "line-clamp-3"
                : "line-clamp-6"
            }`}
          >
            {person.description}
          </p>
        )}
      </div>
    </Link>
  );
}
