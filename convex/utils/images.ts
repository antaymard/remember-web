"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import sharp from "sharp";
import { r2Client, BUCKET_NAME, PUBLIC_URL } from "./r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { requireAuth } from "./requireAuth";

type ImageSize = "xs" | "sm" | "md" | "lg" | "hd";

const SIZES: Record<ImageSize, { width: number; quality: number }> = {
  xs: { width: 64, quality: 75 },
  sm: { width: 200, quality: 85 },
  md: { width: 600, quality: 88 },
  lg: { width: 1200, quality: 90 },
  hd: { width: 1920, quality: 92 },
};

// Called by frontend after successful upload
export const compressImage = action({
  args: {
    publicUrl: v.string(), // The public URL returned by generateUploadUrl
  },
  handler: async (ctx, args) => {
    // Get authenticated userId (throw if not authenticated)
    const userId = await requireAuth(ctx, true);

    console.log(
      `[Compression] Starting for ${args.publicUrl} (user: ${userId})`
    );

    // 1. Check which variants are missing
    const missingVariants = await checkMissingVariants(args.publicUrl);

    if (missingVariants.length === 0) {
      console.log(`[Compression] All variants exist, skipping`);
      return { status: "skipped", reason: "all_variants_exist" };
    }

    console.log(
      `[Compression] Missing variants: ${missingVariants.join(", ")}`
    );

    // 2. Download original from R2
    const originalBuffer = await downloadFromR2(args.publicUrl);

    // 3. Generate only missing variants in parallel
    const variantPromises = missingVariants.map(async (size) => {
      const config = SIZES[size];
      const webpBuffer = await sharp(originalBuffer)
        .resize(config.width, null, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: config.quality })
        .toBuffer();

      // Upload variant to R2
      const variantUrl = await uploadVariantToR2(
        args.publicUrl,
        size,
        webpBuffer,
        userId
      );

      return { size, url: variantUrl };
    });

    const variants = await Promise.all(variantPromises);

    console.log(`[Compression] Generated ${variants.length} variants`);
    return {
      status: "success",
      generated: variants.map((v) => v.size),
      variants: Object.fromEntries(variants.map((v) => [v.size, v.url])),
    };
  },
});

// Helper: Check which variants are missing
async function checkMissingVariants(originalUrl: string): Promise<ImageSize[]> {
  const allSizes: ImageSize[] = ["xs", "sm", "md", "lg", "hd"];
  const missing: ImageSize[] = [];

  await Promise.all(
    allSizes.map(async (size) => {
      const variantUrl = constructVariantUrl(originalUrl, size);
      try {
        const response = await fetch(variantUrl, { method: "HEAD" });
        if (!response.ok) {
          missing.push(size);
        }
      } catch {
        missing.push(size);
      }
    })
  );

  return missing;
}

// Helper: Construct variant URL from original
function constructVariantUrl(originalUrl: string, size: ImageSize): string {
  // Example: https://pub-xxx.r2.dev/userId/uuid_photo.jpg
  //       → https://pub-xxx.r2.dev/userId/uuid_photo_lg.webp
  const url = new URL(originalUrl);
  const pathname = url.pathname;
  const lastSlash = pathname.lastIndexOf("/");
  const dir = pathname.substring(0, lastSlash);
  const filename = pathname.substring(lastSlash + 1);
  const baseName = filename.replace(/\.[^/.]+$/, ""); // Remove extension

  return `${url.origin}${dir}/${baseName}_${size}.webp`;
}

// Helper: Download original from R2
async function downloadFromR2(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

// Helper: Upload variant to R2 using direct client
async function uploadVariantToR2(
  originalUrl: string,
  size: ImageSize,
  buffer: Buffer,
  userId: string
): Promise<string> {
  // Extract key from original URL
  // originalUrl: https://pub-xxx.r2.dev/userId/uuid_photo.jpg
  // Extract: userId/uuid_photo.jpg
  const url = new URL(originalUrl);
  const pathname = url.pathname;
  const keyParts = pathname.substring(1).split("/"); // Remove leading /
  const filename = keyParts[keyParts.length - 1];
  const baseName = filename.replace(/\.[^/.]+$/, "");

  // Construct variant key: userId/uuid_photo_lg.webp
  const variantKey = `${userId}/${baseName}_${size}.webp`;

  // Upload directly to R2
  await r2Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: variantKey,
      Body: buffer,
      ContentType: "image/webp",
    })
  );

  // Return public URL
  return `${PUBLIC_URL}/${variantKey}`;
}
