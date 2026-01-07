import type { MomentType } from "@/types/memory.types";
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

export default function MomentCard({ moment }: { moment: MomentType }) {
  return <div className='aspect-square w-full relative'>
    <Carousel className="w-full aspect-square">
      <CarouselContent className="h-full aspect-square items-center">
        {moment.medias?.map((media, index) => (
          <CarouselItem key={index} className="h-full">
            <img src={media.url} className="w-full h-full object-cover" />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
    <div className="absolute bottom-0 w-full text-white p-4 pt-6 space-y-3" style={{ background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5) 80%, transparent)' }}>
      <h2 className="font-serif truncate line-clamp-1 text-xl">{moment.title}</h2>
      <p className="line-clamp-2 opacity-80">{moment.description}</p>

      <div className="flex opacity-80">
        {renderDate(moment?.date_time_in)}
      </div>
    </div>
  </div>
}
