import { useCallback, useState, useEffect } from "react";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import axios from "axios";

export interface FileUploadProgress {
  progress: number;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
  filename: string;
}

export interface UploadedFileData {
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  uploadedAt: number;
  key: string;
}

export const useUploadFile = () => {
  const generateUploadUrl = useAction(api.uploads.generateUploadUrl);
  const generateUploadUrls = useAction(api.uploads.generateUploadUrls);
  const compressImage = useAction(api.utils.images.compressImage);

  // Map de fileId -> progress
  const [uploads, setUploads] = useState<Record<string, FileUploadProgress>>(
    {}
  );

  /**
   * Upload un seul fichier vers R2 avec retry automatique
   * @param file Le fichier à uploader
   * @param customId ID personnalisé optionnel pour le tracking
   * @param maxRetries Nombre max de tentatives (défaut: 3)
   * @returns Les données du fichier uploadé
   */
  const uploadFile = useCallback(
    async (
      file: File,
      customId?: string,
      maxRetries = 3
    ): Promise<UploadedFileData> => {
      const fileId = customId || crypto.randomUUID();

      // Initialiser le tracking
      setUploads((prev) => ({
        ...prev,
        [fileId]: {
          progress: 0,
          status: "uploading",
          filename: file.name,
        },
      }));

      let lastError: Error | null = null;

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          // 1. Générer URL signée via Convex action
          const { uploadUrl, publicUrl, key } = await generateUploadUrl({
            filename: file.name,
            mimeType: file.type,
            fileSize: file.size,
          });

          // 2. Upload vers R2 avec suivi de progression
          await axios.put(uploadUrl, file, {
            headers: {
              "Content-Type": file.type,
            },
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const percent =
                  (progressEvent.loaded / progressEvent.total) * 100;
                setUploads((prev) => ({
                  ...prev,
                  [fileId]: { ...prev[fileId], progress: percent },
                }));
              }
            },
          });

          // 3. Marquer comme terminé
          setUploads((prev) => ({
            ...prev,
            [fileId]: { ...prev[fileId], status: "done", progress: 100 },
          }));

          // 4. Trigger compression (fire-and-forget, non-blocking)
          if (file.type.startsWith("image/")) {
            compressImage({ publicUrl })
              .then(() => console.log(`[Compression] Started for ${file.name}`))
              .catch((err) => console.error(`[Compression] Failed for ${file.name}:`, err));
          }

          // 5. Retourner les données du fichier
          const fileData: UploadedFileData = {
            url: publicUrl,
            filename: file.name,
            mimeType: file.type,
            size: file.size,
            uploadedAt: Date.now(),
            key,
          };

          return fileData;
        } catch (error) {
          lastError = error instanceof Error ? error : new Error("Upload failed");

          // Si c'est la dernière tentative, on throw
          if (attempt === maxRetries - 1) {
            const errorMessage = lastError?.message || "Upload failed";
            setUploads((prev) => ({
              ...prev,
              [fileId]: {
                ...prev[fileId],
                status: "error",
                error: errorMessage,
              },
            }));
            throw lastError;
          }

          // Sinon, on attend un peu avant de retry (backoff exponentiel)
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * Math.pow(2, attempt))
          );
        }
      }

      // Cette ligne ne devrait jamais être atteinte, mais TypeScript l'exige
      throw lastError || new Error("Upload failed");
    },
    [generateUploadUrl]
  );

  /**
   * Upload plusieurs fichiers en parallèle
   * @returns Un tableau des données des fichiers uploadés
   */
  const uploadMultiple = useCallback(
    async (files: File[]): Promise<UploadedFileData[]> => {
      const fileIds = files.map(() => crypto.randomUUID());

      // Initialiser le tracking pour tous les fichiers
      setUploads((prev) => {
        const newUploads = { ...prev };
        fileIds.forEach((id, index) => {
          newUploads[id] = {
            progress: 0,
            status: "uploading",
            filename: files[index].name,
          };
        });
        return newUploads;
      });

      // 1. Générer toutes les URLs signées en une seule fois
      const uploadData = await generateUploadUrls({
        files: files.map((f) => ({
          filename: f.name,
          mimeType: f.type,
          fileSize: f.size,
        })),
      });

      // 2. Upload tous les fichiers en parallèle
      const uploadPromises = files.map(async (file, index) => {
        const fileId = fileIds[index];
        const { uploadUrl, publicUrl, key } = uploadData[index];

        try {
          await axios.put(uploadUrl, file, {
            headers: {
              "Content-Type": file.type,
            },
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const percent =
                  (progressEvent.loaded / progressEvent.total) * 100;
                setUploads((prev) => ({
                  ...prev,
                  [fileId]: { ...prev[fileId], progress: percent },
                }));
              }
            },
          });

          setUploads((prev) => ({
            ...prev,
            [fileId]: { ...prev[fileId], status: "done", progress: 100 },
          }));

          // Trigger compression (fire-and-forget, non-blocking)
          if (file.type.startsWith("image/")) {
            compressImage({ publicUrl })
              .then(() => console.log(`[Compression] Started for ${file.name}`))
              .catch((err) => console.error(`[Compression] Failed for ${file.name}:`, err));
          }

          return {
            url: publicUrl,
            filename: file.name,
            mimeType: file.type,
            size: file.size,
            uploadedAt: Date.now(),
            key,
          };
        } catch (error) {
          setUploads((prev) => ({
            ...prev,
            [fileId]: {
              ...prev[fileId],
              status: "error",
              error: error instanceof Error ? error.message : "Upload failed",
            },
          }));
          throw error;
        }
      });

      return await Promise.all(uploadPromises);
    },
    [generateUploadUrls]
  );

  /**
   * Nettoie le tracking d'un fichier spécifique
   */
  const clearUpload = useCallback((fileId: string) => {
    setUploads((prev) => {
      const newUploads = { ...prev };
      delete newUploads[fileId];
      return newUploads;
    });
  }, []);

  /**
   * Nettoie tous les fichiers terminés (done ou error)
   */
  const clearCompletedUploads = useCallback(() => {
    setUploads((prev) => {
      const newUploads = { ...prev };
      Object.keys(newUploads).forEach((id) => {
        if (
          newUploads[id].status === "done" ||
          newUploads[id].status === "error"
        ) {
          delete newUploads[id];
        }
      });
      return newUploads;
    });
  }, []);

  // Auto-cleanup des uploads terminés toutes les 30 secondes
  useEffect(() => {
    const timer = setInterval(() => {
      clearCompletedUploads();
    }, 30000); // 30 secondes

    return () => clearInterval(timer);
  }, [clearCompletedUploads]);

  return {
    uploadFile, // Single upload - retourne UploadedFileData
    uploadMultiple, // Multiple uploads - retourne UploadedFileData[]
    uploads, // Record<fileId, FileUploadProgress> - pour afficher la progression
    clearUpload, // Nettoyer un upload spécifique
    clearCompletedUploads, // Nettoyer tous les uploads terminés
  };
};
