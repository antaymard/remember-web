import type { PlaceWithCreator } from "@/types/memory.types";
import OptimizedImage from "@/components/ui/OptimizedImage";
import MemoryTypeIndicator from "./MemoryTypeIndicator";
import MediasCarousel from "../ui/MediasCarousel";
import { Link } from "@tanstack/react-router";
import type { Id } from "@/../convex/_generated/dataModel";

export default function PlaceMemoryCard({
  place,
}: {
  place: PlaceWithCreator;
}) {
  return (
    <Link
      to="/view/$type/$_id"
      params={{
        type: "place",
        _id: place._id as Id<"places">,
      }}
      state={{
        optimisticData: place,
      }}
    >
      <div className="bg-white py-4 space-y-3">
        {/* Header */}
        <div className="flex px-4 items-center gap-3 w-full">
          {place.creator?.medias?.[0] && (
            <OptimizedImage
              media={place.creator.medias[0]}
              size="sm"
              className="w-10 h-10 aspect-square rounded-full object-cover"
            />
          )}
          <div className="flex flex-col w-full min-w-0">
            <h2 className="font-serif text-xl leading-tight truncate">
              {place.title}
            </h2>
            <p className="leading-tight opacity-80 text-sm">
              {place.creator?.firstname} {place.creator?.lastname}
            </p>
          </div>
          <MemoryTypeIndicator memoryType="place" />
        </div>
        {place.medias && place.medias.length > 0 && (
          <div className="aspect-square w-full relative">
            <MediasCarousel medias={place.medias} aspectSquare />
          </div>
        )}
        {place.description && (
          <p
            className={`leading-tight opacity-80 px-4 ${
              place.medias && place.medias.length > 0
                ? "line-clamp-3"
                : "line-clamp-6"
            }`}
          >
            {place.description}
          </p>
        )}
      </div>
    </Link>
  );
}
