import type { PersonWithCreator } from "@/types/memory.types";
import { Link } from "@tanstack/react-router";
import type { Id } from "@/../convex/_generated/dataModel";
import MediasCarousel from "@/components/ui/MediasCarousel";
import MemoryTypeIndicator from "./MemoryTypeIndicator";

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
    >
      <div className="bg-white py-4 space-y-3">
        {/* Header */}
        <div className="flex px-4 items-center gap-3 w-full">
          <img
            src={person.creator?.medias?.[0]?.url}
            className="w-10 h-10 aspect-square rounded-full object-cover"
          />
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
        <div className="aspect-square w-full relative">
          {person.medias && person.medias.length > 0 && (
            <>
              <MediasCarousel medias={person.medias} aspectSquare />
            </>
          )}
        </div>
        {person.description && (
          <p className="line-clamp-3 leading-tight opacity-80 px-4">
            {person.description}
          </p>
        )}
      </div>
    </Link>
  );
}
