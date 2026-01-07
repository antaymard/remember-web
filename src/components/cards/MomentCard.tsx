import type { MomentType, PersonType } from "@/types/memory.types";
import { Carousel, CarouselContent, CarouselItem } from "../shadcn/carousel";
import type { FlexibleDateTime } from "@/types/shared.types";
import { TbCalendar } from "react-icons/tb";

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

export default function MomentCard({ moment }: { moment: MomentType }) {
  return (
    <div className="bg-white py-4 space-y-3">
      {/* Header */}
      <div className="flex px-4 items-center gap-3">
        <img src="/default-avatar.png" className="w-10 h-10 rounded-full" />
        <div className="flex flex-col">
          <h2 className="font-serif truncate text-xl leading-tight line-clamp-1">
            {moment.title}
          </h2>
          <p className="leading-tight opacity-80 text-sm">Antoine Aymard</p>
        </div>
      </div>
      <div className="aspect-square w-full relative">
        {renderPresentPersons(moment.present_persons as PersonType[])}

        <Carousel className="w-full aspect-square">
          <CarouselContent className="h-full aspect-square items-center">
            {moment.medias?.map((media, index) => (
              <CarouselItem key={index} className="h-full">
                <img src={media.url} className="w-full h-full object-cover" />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
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
  );
}
