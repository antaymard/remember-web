import exifr from "exifr";
import type { ImageData } from "@/types/image";

/**
 * Extracts EXIF metadata from an image file
 * @param file The image file to extract EXIF data from
 * @returns Partial ImageData with EXIF information
 */
export async function extractExifData(
  file: File
): Promise<Partial<ImageData>> {
  try {
    // Extract EXIF data using exifr
    const exif = await exifr.parse(file, true);

    if (!exif) {
      return {};
    }

    const metadata: Partial<ImageData> = {};

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

    // Extract original dimensions
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

    return metadata;
  } catch (error) {
    console.error("Error extracting EXIF data:", error);
    // Return empty object if extraction fails - we don't want to block upload
    return {};
  }
}
