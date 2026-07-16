import type { MomentWithCreator, PersonType } from "@/types/memory.types";
import { TbCalendar } from "react-icons/tb";
import { Link } from "@tanstack/react-router";
import type { Id } from "@/../convex/_generated/dataModel";
import MediasCarousel from "@/components/ui/MediasCarousel";
import MemoryTypeIndicator from "./MemoryTypeIndicator";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { formatFlexibleDate } from "@/utils/formatDate";

function renderPresentPersons(presentPersons: PersonType[] | undefined) {
  if (!presentPersons || presentPersons.length === 0) return null;
  return (
    <div className="absolute bottom-8 right-4 flex flex-col -gap-2 z-10">
      {presentPersons.map((person, i) => {
        if (!person?.medias?.[0]) return null;
        return (
          <div
            key={i}
            className="w-12 h-12 rounded-full border-2 border-white overflow-hidden -mb-2"
          >
            <OptimizedImage
              media={person.medias[0]}
              size="sm"
              className="w-full h-full object-cover"
            />
          </div>
        );
      })}
    </div>
  );
}

export default function MomentMemoryCard({
  moment,
}: {
  moment: MomentWithCreator;
}) {
  if (!moment) return null;

  return (
    <Link
      to="/view/$type/$_id"
      params={{
        type: "moment",
        _id: moment._id as Id<"moments">,
      }}
      state={{
        optimisticData: moment,
      }}
    >
      <div className="bg-white py-4 space-y-3">
        {/* Header */}
        <div className="flex px-4 items-center gap-3 w-full">
          {moment.creator?.medias?.[0] && (
            <OptimizedImage
              media={moment.creator.medias[0]}
              size="sm"
              className="w-10 h-10 aspect-square rounded-full object-cover"
            />
          )}
          <div className="flex flex-col w-full min-w-0">
            <h2 className="font-serif text-xl leading-tight truncate">
              {moment.title}
            </h2>
            <p className="leading-tight opacity-80 text-sm">
              {moment.creator?.firstname} {moment.creator?.lastname}
            </p>
          </div>
          <MemoryTypeIndicator memoryType="moment" />
        </div>
        {moment.medias && moment.medias.length > 0 && (
          <div className="aspect-square w-full relative">
            <MediasCarousel medias={moment.medias} aspectSquare />
            {renderPresentPersons(moment.present_persons)}
          </div>
        )}
        {moment.description && (
          <p
            className={`leading-tight opacity-80 px-4 ${
              moment.medias && moment.medias.length > 0
                ? "line-clamp-3"
                : "line-clamp-6"
            }`}
          >
            {moment.description}
          </p>
        )}
        {formatFlexibleDate(moment?.date_time_in) && (
          <div className="flex gap-2 items-center opacity-80 text-sm px-4">
            <TbCalendar size={16} />
            {formatFlexibleDate(moment?.date_time_in)}
          </div>
        )}
      </div>
    </Link>
  );
}
