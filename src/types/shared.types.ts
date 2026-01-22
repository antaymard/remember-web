/**
 * Image data structure for form submissions
 */
export interface MediaData {
  /** Public URL of the uploaded image */
  url: string;
  /** Timestamp when the image was uploaded (milliseconds since epoch) */
  upload_date: number;
  /** Timestamp when the photo was taken, extracted from EXIF (milliseconds since epoch) */
  shot_date?: number;
  type: "image";
  /** GPS coordinates extracted from EXIF */
  gps_coordinates?: {
    latitude: number;
    longitude: number;
  };
  /** Image orientation from EXIF (1-8) */
  orientation?: number;
  /** Camera/device model that took the photo */
  camera_model?: string;
  /** Original image dimensions */
  original_dimensions?: {
    width: number;
    height: number;
  };
}

export interface FlexibleDateTime {
  year?: number;
  month?: number;
  day?: number;
  hour?: number;
  min?: number;
}

export type MemoryType = "moment" | "place" | "person" | "thing";
