import type { MediaData } from "@/types/shared.types";

export type ImageSize = 'xs' | 'sm' | 'md' | 'lg' | 'hd';

interface OptimizedImageProps {
  media: MediaData;
  size: ImageSize;
  className?: string;
  alt?: string;
  onClick?: () => void;
}

export default function OptimizedImage({
  media,
  size,
  className,
  alt = "",
  onClick,
}: OptimizedImageProps) {
  // Construct variant URL from original URL + size suffix
  const src = constructVariantUrl(media.url, size);

  return (
    <img
      src={src}
      className={className}
      alt={alt}
      loading="lazy"
      onClick={onClick}
      onError={(e) => {
        // Fallback to original if variant doesn't exist yet
        const target = e.target as HTMLImageElement;
        if (target.src !== media.url) {
          target.src = media.url;
        }
      }}
    />
  );
}

// Helper: Construct variant URL with suffix
function constructVariantUrl(originalUrl: string, size: ImageSize): string {
  // Example: https://r2.domain/user123/photo.jpg
  //       → https://r2.domain/user123/photo_lg.webp
  try {
    const url = new URL(originalUrl);
    const pathname = url.pathname;
    const lastSlash = pathname.lastIndexOf('/');
    const dir = pathname.substring(0, lastSlash);
    const filename = pathname.substring(lastSlash + 1);
    const baseName = filename.replace(/\.[^/.]+$/, ''); // Remove extension

    return `${url.origin}${dir}/${baseName}_${size}.webp`;
  } catch {
    // If URL construction fails, return original
    return originalUrl;
  }
}
