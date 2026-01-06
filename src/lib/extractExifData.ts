import exifr from "exifr";
import type { ImageData } from "@/types/media";

/**
 * Loads an image and returns its natural dimensions
 * @param file The image file to load
 * @returns Promise with width and height
 */
async function getImageDimensions(
  file: File
): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };

    img.src = url;
  });
}

/**
 * Extracts EXIF metadata from an image file
 * @param file The image file to extract EXIF data from
 * @returns Partial ImageData with EXIF information
 */
export async function extractExifData(file: File): Promise<Partial<ImageData>> {
  const metadata: Partial<ImageData> = {};

  // Only try EXIF extraction for formats that commonly support it
  const exifSupportedFormats = [
    "image/jpeg",
    "image/jpg",
    "image/tiff",
    "image/heic",
    "image/heif",
  ];

  const shouldExtractExif = exifSupportedFormats.includes(
    file.type.toLowerCase()
  );

  // Try to extract EXIF data for supported formats
  if (shouldExtractExif) {
    try {
      const exif = await exifr.parse(file, true);

      if (exif) {
        // Extract shot date from various EXIF fields (in order of preference)
        if (exif.DateTimeOriginal) {
          metadata.shot_date = new Date(exif.DateTimeOriginal).getTime();
        } else if (exif.DateTime) {
          metadata.shot_date = new Date(exif.DateTime).getTime();
        } else if (exif.CreateDate) {
          metadata.shot_date = new Date(exif.CreateDate).getTime();
        }

        // Extract GPS coordinates
        if (exif.latitude && exif.longitude) {
          metadata.gps_coordinates = {
            latitude: exif.latitude,
            longitude: exif.longitude,
          };
        }

        // Extract orientation
        if (exif.Orientation) {
          metadata.orientation = exif.Orientation;
        }

        // Extract camera model
        if (exif.Model || exif.Make) {
          const make = exif.Make ? exif.Make.trim() : "";
          const model = exif.Model ? exif.Model.trim() : "";

          // Avoid duplication if model already contains make
          if (make && model && !model.includes(make)) {
            metadata.camera_model = `${make} ${model}`;
          } else if (model) {
            metadata.camera_model = model;
          } else if (make) {
            metadata.camera_model = make;
          }
        }

        // Extract original dimensions from EXIF
        if (exif.ImageWidth && exif.ImageHeight) {
          metadata.original_dimensions = {
            width: exif.ImageWidth,
            height: exif.ImageHeight,
          };
        } else if (exif.ExifImageWidth && exif.ExifImageHeight) {
          metadata.original_dimensions = {
            width: exif.ExifImageWidth,
            height: exif.ExifImageHeight,
          };
        }
      }
    } catch (error) {
      // Silently ignore EXIF parsing errors
      // This is expected for images without EXIF or with corrupted metadata
    }
  }

  // Always try to get dimensions if not already present
  // This handles cases where EXIF is missing or failed to parse
  if (!metadata.original_dimensions) {
    try {
      const dimensions = await getImageDimensions(file);
      if (dimensions) {
        metadata.original_dimensions = dimensions;
      }
    } catch (error) {
      console.error("Error getting image dimensions:", error);
    }
  }

  return metadata;
}
