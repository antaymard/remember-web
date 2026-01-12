import type { ThingWithCreator } from "@/types/memory.types";
import OptimizedImage from "@/components/ui/OptimizedImage";
import MemoryTypeIndicator from "./MemoryTypeIndicator";
import MediasCarousel from "../ui/MediasCarousel";
import { Link } from "@tanstack/react-router";
import type { Id } from "@/../convex/_generated/dataModel";

export default function ThingMemoryCard({
  thing,
}: {
  thing: ThingWithCreator;
}) {
  return (
    <Link
      to="/view/$type/$_id"
      params={{
        type: "thing",
        _id: thing._id as Id<"things">,
      }}
      state={{
        optimisticData: thing,
      }}
    >
      <div className="bg-white py-4 space-y-3">
        {/* Header */}
        <div className="flex px-4 items-center gap-3 w-full">
          {thing.creator?.medias?.[0] && (
            <OptimizedImage
              media={thing.creator.medias[0]}
              size="sm"
              className="w-10 h-10 aspect-square rounded-full object-cover"
            />
          )}
          <div className="flex flex-col w-full min-w-0">
            <h2 className="font-serif text-xl leading-tight truncate">
              {thing.title}
            </h2>
            <p className="leading-tight opacity-80 text-sm">
              {thing.creator?.firstname} {thing.creator?.lastname}
            </p>
          </div>
          <MemoryTypeIndicator memoryType="thing" />
        </div>
        <div className="aspect-square w-full relative">
          {thing.medias && thing.medias.length > 0 && (
            <>
              <MediasCarousel medias={thing.medias} aspectSquare />
            </>
          )}
        </div>
        {thing.description && (
          <p className="line-clamp-3 leading-tight opacity-80 px-4">
            {thing.description}
          </p>
        )}
      </div>
    </Link>
  );
}
