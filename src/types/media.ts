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

/**
 * Local image state before/during upload
 */
export interface LocalMediaState extends Partial<MediaData> {
  /** Unique ID for tracking upload progress */
  id: string;
  /** Local file object */
  file: File;
  /** Local preview URL (object URL) */
  preview: string;
  /** Upload status */
  status: "pending" | "uploading" | "done" | "error";
  /** Upload progress (0-100) */
  progress: number;
  /** Error message if upload failed */
  error?: string;
}
