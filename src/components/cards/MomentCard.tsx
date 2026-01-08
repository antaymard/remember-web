import type { MomentWithCreator, PersonType } from "@/types/memory.types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "../shadcn/carousel";
import type { FlexibleDateTime } from "@/types/shared.types";
import { TbCalendar } from "react-icons/tb";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import type { Id } from "@/../convex/_generated/dataModel";

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

export default function MomentCard({ moment }: { moment: MomentWithCreator }) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sync carousel index
  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setCurrentIndex(carouselApi.selectedScrollSnap());
    };

    carouselApi.on("select", onSelect);
    onSelect();

    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

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
        </div>
        <div className="aspect-square w-full relative">
          {renderPresentPersons(moment.present_persons)}

          <Carousel setApi={setCarouselApi} className="w-full aspect-square">
            <CarouselContent className="h-full aspect-square items-center">
              {moment.medias?.map((media, index) => (
                <CarouselItem key={index} className="h-full">
                  <img src={media.url} className="w-full h-full object-cover" />
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Pagination dots - bottom center */}
            {moment.medias && moment.medias.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-10">
                {moment.medias.map((_, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      idx === currentIndex
                        ? "w-6 bg-white"
                        : "w-1.5 bg-white/40"
                    )}
                  />
                ))}
              </div>
            )}
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
    </Link>
  );
}
