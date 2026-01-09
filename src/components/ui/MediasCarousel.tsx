import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import type { MediaData } from "@/types/shared.types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/shadcn/carousel";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ButtonPastel } from "./Button";
import OptimizedImage, { type ImageSize } from "./OptimizedImage";

interface MediasCarouselProps {
  /** Array of media to display */
  medias: MediaData[];
  /** Whether to force square aspect ratio (default: false = height of tallest image) */
  aspectSquare?: boolean;
  /** Whether clicking opens fullscreen zoomable view (default: true) */
  clickableFullscreen?: boolean;
  /** Additional CSS classes for the container */
  className?: string;
  /** Image size variant to use for carousel images (default: 'lg') */
  imageSize?: ImageSize;
  /** Image size variant to use for fullscreen images (default: 'hd') */
  fullscreenImageSize?: ImageSize;
}

export default function MediasCarousel({
  medias,
  aspectSquare = false,
  clickableFullscreen = true,
  className,
  imageSize = 'lg',
  fullscreenImageSize = 'hd',
}: MediasCarouselProps) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);

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

  const handleImageClick = (index: number) => {
    if (clickableFullscreen) {
      setFullscreenIndex(index);
    }
  };

  const closeFullscreen = () => {
    setFullscreenIndex(null);
  };

  if (medias.length === 0) {
    return null;
  }

  return (
    <>
      <div className={cn("relative w-full", className)}>
        <Carousel
          setApi={setCarouselApi}
          className={cn("w-full", aspectSquare && "aspect-square")}
        >
          <CarouselContent
            className={cn(
              "h-full items-center",
              aspectSquare && "aspect-square"
            )}
          >
            {medias.map((media, index) => (
              <CarouselItem key={`${media.url}-${index}`} className="h-full">
                <div className="relative w-full h-full flex items-center justify-center">
                  <OptimizedImage
                    media={media}
                    size={imageSize}
                    alt={`Media ${index + 1}`}
                    className={cn(
                      "w-full h-full object-cover",
                      clickableFullscreen && "cursor-pointer"
                    )}
                    onClick={() => handleImageClick(index)}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Pagination dots - bottom center */}
          {medias.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-10">
              {medias.map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    idx === currentIndex ? "w-6 bg-white" : "w-1.5 bg-white/40"
                  )}
                />
              ))}
            </div>
          )}
        </Carousel>
      </div>

      {/* Fullscreen modal with zoom/pan/pinch */}
      {fullscreenIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <ButtonPastel
            onClick={closeFullscreen}
            className="fixed top-4 right-4 z-100"
            icon="x"
            color="green"
            variant="solid"
          />
          <TransformWrapper
            initialScale={1}
            minScale={1}
            maxScale={8}
            centerOnInit
            doubleClick={{ disabled: false, step: 0.7 }}
            wheel={{ step: 0.2 }}
          >
            <TransformComponent
              wrapperClass="w-full h-full"
              contentClass="w-full h-full flex items-center justify-center"
            >
              <OptimizedImage
                media={medias[fullscreenIndex]}
                size={fullscreenImageSize}
                alt={`Media ${fullscreenIndex + 1}`}
                className="w-screen h-screen object-contain"
              />
            </TransformComponent>
          </TransformWrapper>
        </div>
      )}
    </>
  );
}
