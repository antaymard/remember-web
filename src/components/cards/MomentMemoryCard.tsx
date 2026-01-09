import type { MomentWithCreator, PersonType } from "@/types/memory.types";
import type { FlexibleDateTime } from "@/types/shared.types";
import { TbCalendar } from "react-icons/tb";
import { Link } from "@tanstack/react-router";
import type { Id } from "@/../convex/_generated/dataModel";
import MediasCarousel from "@/components/ui/MediasCarousel";
import MemoryTypeIndicator from "./MemoryTypeIndicator";

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

function renderPresentPersons(presentPersons: PersonType[] | undefined) {
  if (!presentPersons || presentPersons.length === 0) return null;
  return (
    <div className="absolute bottom-8 right-4 flex flex-col -gap-2 z-10">
      {presentPersons.map((person, i) => (
        <div
          key={i}
          className="w-12 h-12 rounded-full border-2 border-white overflow-hidden -mb-2"
        >
          <img
            src={person?.medias?.[0]?.url}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
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
    >
      <div className="bg-white py-4 space-y-3">
        {/* Header */}
        <div className="flex px-4 items-center gap-3 w-full">
          <img
            src={moment.creator?.medias?.[0]?.url}
            className="w-10 h-10 aspect-square rounded-full object-cover"
          />
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
        <div className="aspect-square w-full relative">
          {moment.medias && moment.medias.length > 0 && (
            <>
              <MediasCarousel medias={moment.medias} aspectSquare />
              {renderPresentPersons(moment.present_persons)}
            </>
          )}
        </div>
        {moment.description && (
          <p className="line-clamp-3 leading-tight opacity-80 px-4">
            {moment.description}
          </p>
        )}
        <div className="flex opacity-80 text-sm px-4">
          {renderDate(moment?.date_time_in)}
        </div>
      </div>
    </Link>
  );
}
