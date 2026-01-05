import { v } from "convex/values";
import { action } from "./_generated/server";
import { generatePresignedUrl, getPublicUrl } from "./utils/r2";
import { requireAuth } from "./utils/requireAuth";
import { ActionCtx } from "./_generated/server";

// Configuration de validation
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_MIME_TYPES = [
  // Images
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
  // Vidéos
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "video/x-msvideo",
];

function validateFile(filename: string, mimeType: string, fileSize?: number) {
  // Validation MIME type
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    throw new Error(
      `Type de fichier non autorisé: ${mimeType}. Types acceptés: ${ALLOWED_MIME_TYPES.join(", ")}`
    );
  }

  // Validation taille (si fournie)
  if (fileSize !== undefined && fileSize > MAX_FILE_SIZE) {
    throw new Error(
      `Fichier trop volumineux: ${(fileSize / 1024 / 1024).toFixed(2)}MB. Taille max: ${MAX_FILE_SIZE / 1024 / 1024}MB`
    );
  }

  // Validation nom de fichier
  if (!filename || filename.length === 0) {
    throw new Error("Nom de fichier vide");
  }

  if (filename.length > 255) {
    throw new Error("Nom de fichier trop long (max 255 caractères)");
  }
}

// Single file upload - Action publique avec validation
export const generateUploadUrl = action({
  args: {
    filename: v.string(),
    mimeType: v.string(),
    fileSize: v.optional(v.number()),
  },
  handler: async (ctx: ActionCtx, args) => {
    const userId = await requireAuth(ctx);

    // Validation du fichier
    validateFile(args.filename, args.mimeType, args.fileSize);

    const uniqueId = crypto.randomUUID();
    const sanitizedFilename = args.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `${userId}/${uniqueId}_${sanitizedFilename}`;

    const uploadUrl = await generatePresignedUrl(key, args.mimeType);
    const publicUrl = getPublicUrl(key);

    return {
      uploadUrl, // Pour le PUT du client
      publicUrl, // À sauvegarder dans le node après upload
      key, // Pour référence/delete futur
    };
  },
});

// Multiple files upload - Action publique avec validation
export const generateUploadUrls = action({
  args: {
    files: v.array(
      v.object({
        filename: v.string(),
        mimeType: v.string(),
        fileSize: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx: ActionCtx, args) => {
    const userId = await requireAuth(ctx);

    return Promise.all(
      args.files.map(async (file) => {
        // Validation de chaque fichier
        validateFile(file.filename, file.mimeType, file.fileSize);

        const uniqueId = crypto.randomUUID();
        const sanitizedFilename = file.filename.replace(
          /[^a-zA-Z0-9._-]/g,
          "_"
        );
        const key = `${userId}/${uniqueId}_${sanitizedFilename}`;

        const uploadUrl = await generatePresignedUrl(key, file.mimeType);
        const publicUrl = getPublicUrl(key);

        return { uploadUrl, publicUrl, key };
      })
    );
  },
});
