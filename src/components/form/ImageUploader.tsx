import { cn } from "@/lib/utils";
import {
  TbArrowMoveLeft,
  TbArrowMoveRight,
  TbTrash,
  TbPlus,
} from "react-icons/tb";
import { useRef, useState, useEffect } from "react";
import { useUploadFile } from "@/hooks/useUploadFiles";
import { extractExifData } from "@/lib/extractExifData";
import type { ImageData, LocalImageState } from "@/types/image";
import toast from "react-hot-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/shadcn/carousel";

const buttonClassName =
  "bg-white p-1 h-8 flex items-center justify-center disabled:opacity-50 transition-opacity";

const smallButtonClassName = cn(buttonClassName, "h-7.5 w-7.5 rounded-sm");
const bigButtonClassName = cn(buttonClassName, "h-12.5 w-12.5 rounded-2xl");

const smallIconSize = 20;
const bigIconSize = 22;

interface ImageUploaderProps {
  form: any;
  name?: string;
  maxImages?: number;
}

export default function ImageUploader({
  form,
  name = "images",
  maxImages = 10,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localImages, setLocalImages] = useState<LocalImageState[]>([]);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { uploadFile } = useUploadFile();

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

  // Handle file selection
  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) return;

    // Check max images limit
    if (localImages.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images autorisées`);
      return;
    }

    // Validate files are images
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    if (imageFiles.length !== files.length) {
      toast.error("Seules les images sont autorisées");
    }

    // Create local state for each file
    const newLocalImages: LocalImageState[] = imageFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      status: "pending",
      progress: 0,
    }));

    setLocalImages((prev) => [...prev, ...newLocalImages]);

    // Upload each file
    for (const localImage of newLocalImages) {
      uploadImage(localImage);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Upload a single image
  const uploadImage = async (localImage: LocalImageState) => {
    try {
      // Update status to uploading
      setLocalImages((prev) =>
        prev.map((img) =>
          img.id === localImage.id ? { ...img, status: "uploading" } : img
        )
      );

      // Extract EXIF data
      const exifData = await extractExifData(localImage.file);

      // Upload file to R2
      const uploadedData = await uploadFile(localImage.file, localImage.id);

      // Create complete ImageData
      const imageData: ImageData = {
        url: uploadedData.url,
        upload_date: uploadedData.uploadedAt,
        ...exifData,
      };

      // Update local state with complete data
      setLocalImages((prev) =>
        prev.map((img) =>
          img.id === localImage.id
            ? { ...img, ...imageData, status: "done", progress: 100 }
            : img
        )
      );

      // Update form value
      form.setFieldValue(name, (prev: ImageData[] = []) => [...prev, imageData]);
    } catch (error) {
      console.error("Upload error:", error);

      // Update local state with error
      setLocalImages((prev) =>
        prev.map((img) =>
          img.id === localImage.id
            ? {
                ...img,
                status: "error",
                error:
                  error instanceof Error ? error.message : "Upload échoué",
              }
            : img
        )
      );

      // Show toast error
      toast.error(`Échec de l'upload: ${localImage.file.name}`);

      // Remove from local images after a delay
      setTimeout(() => {
        removeImage(localImage.id);
      }, 3000);
    }
  };

  // Remove image
  const removeImage = (imageId: string) => {
    const imageToRemove = localImages.find((img) => img.id === imageId);
    if (!imageToRemove) return;

    // Revoke object URL to free memory
    URL.revokeObjectURL(imageToRemove.preview);

    // Remove from local state
    setLocalImages((prev) => prev.filter((img) => img.id !== imageId));

    // Remove from form value
    form.setFieldValue(name, (prev: ImageData[] = []) =>
      prev.filter((img) => img.url !== imageToRemove.url)
    );

    // Adjust carousel if needed
    if (carouselApi && localImages.length > 1) {
      const newIndex = Math.min(currentIndex, localImages.length - 2);
      if (newIndex !== currentIndex) {
        carouselApi.scrollTo(newIndex);
      }
    }
  };

  // Move image up (left)
  const moveImageUp = () => {
    if (currentIndex === 0) return;

    const newIndex = currentIndex - 1;
    moveImage(currentIndex, newIndex);
  };

  // Move image down (right)
  const moveImageDown = () => {
    if (currentIndex >= localImages.length - 1) return;

    const newIndex = currentIndex + 1;
    moveImage(currentIndex, newIndex);
  };

  // Reorder images
  const moveImage = (fromIndex: number, toIndex: number) => {
    setLocalImages((prev) => {
      const newImages = [...prev];
      const [movedImage] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, movedImage);
      return newImages;
    });

    // Update form value with reordered images
    form.setFieldValue(name, (prev: ImageData[] = []) => {
      const newImages = [...prev];
      const [movedImage] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, movedImage);
      return newImages;
    });

    // Scroll carousel to new position
    if (carouselApi) {
      carouselApi.scrollTo(toIndex);
    }
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      localImages.forEach((img) => {
        URL.revokeObjectURL(img.preview);
      });
    };
  }, []);

  const hasImages = localImages.length > 0;
  const canAddMore = localImages.length < maxImages;
  const currentImage = localImages[currentIndex];
  const isUploading = currentImage?.status === "uploading";

  return (
    <form.Field name={name}>
      {() => (
        <div className="relative aspect-square w-screen bg-greylight">
          {hasImages ? (
            <Carousel setApi={setCarouselApi} className="w-full h-full">
              <CarouselContent className="h-full">
                {localImages.map((image) => (
                  <CarouselItem key={image.id} className="h-full">
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img
                        src={image.preview}
                        alt="Preview"
                        className={cn(
                          "w-full h-full object-cover",
                          image.status === "uploading" && "animate-pulse"
                        )}
                      />
                      {image.status === "error" && (
                        <div className="absolute inset-0 bg-red/20 flex items-center justify-center">
                          <p className="text-white font-medium bg-red/80 px-4 py-2 rounded">
                            Erreur d'upload
                          </p>
                        </div>
                      )}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Reorder buttons - top right */}
              <div className="absolute flex items-center gap-2 top-4 right-4 z-10">
                <button
                  type="button"
                  className={smallButtonClassName}
                  onClick={moveImageUp}
                  disabled={currentIndex === 0 || isUploading}
                >
                  <TbArrowMoveLeft size={smallIconSize} />
                </button>
                <button
                  type="button"
                  className={smallButtonClassName}
                  onClick={moveImageDown}
                  disabled={
                    currentIndex >= localImages.length - 1 || isUploading
                  }
                >
                  <TbArrowMoveRight size={smallIconSize} />
                </button>
              </div>

              {/* Delete button - bottom left */}
              <button
                type="button"
                className={cn(
                  bigButtonClassName,
                  "absolute bottom-4 left-4 text-red z-10"
                )}
                onClick={() => currentImage && removeImage(currentImage.id)}
                disabled={isUploading}
              >
                <TbTrash size={bigIconSize} />
              </button>

              {/* Pagination dots - bottom center */}
              {localImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-10">
                  {localImages.map((image, idx) => (
                    <div
                      key={image.id}
                      className={cn(
                        "h-1.5 rounded-full transition-all",
                        idx === currentIndex
                          ? "w-6 bg-white"
                          : "w-1.5 bg-white/50",
                        image.status === "uploading" && "animate-pulse"
                      )}
                    />
                  ))}
                </div>
              )}

              {/* Add more button - bottom right */}
              {canAddMore && (
                <button
                  type="button"
                  className={cn(
                    bigButtonClassName,
                    "absolute bottom-4 right-4 text-green z-10"
                  )}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <TbPlus size={bigIconSize} />
                </button>
              )}
            </Carousel>
          ) : (
            // Empty state - big add button centered
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                className={cn(
                  "bg-white rounded-2xl h-20 w-20 flex items-center justify-center text-green hover:bg-green/10 transition-colors"
                )}
                onClick={() => fileInputRef.current?.click()}
              >
                <TbPlus size={32} />
              </button>
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      )}
    </form.Field>
  );
}
