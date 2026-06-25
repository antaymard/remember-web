import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Vérification des variables d'environnement au démarrage
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const BUCKET_NAME = process.env.R2_BUCKET_NAME;
const PUBLIC_URL = process.env.R2_PUBLIC_URL;

if (!R2_ACCOUNT_ID) {
  throw new Error("R2_ACCOUNT_ID environment variable is missing");
}
if (!R2_ACCESS_KEY_ID) {
  throw new Error("R2_ACCESS_KEY_ID environment variable is missing");
}
if (!R2_SECRET_ACCESS_KEY) {
  throw new Error("R2_SECRET_ACCESS_KEY environment variable is missing");
}
if (!BUCKET_NAME) {
  throw new Error("R2_BUCKET_NAME environment variable is missing");
}
if (!PUBLIC_URL) {
  throw new Error("R2_PUBLIC_URL environment variable is missing");
}

// Configuration du client R2
const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

// Export pour utilisation dans d'autres modules (image compression)
export { r2Client };
export { BUCKET_NAME };
export { PUBLIC_URL };

export async function generatePresignedUrl(
  key: string,
  mimeType: string
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: mimeType,
  });

  // URL valide 15 minutes
  return await getSignedUrl(r2Client, command, { expiresIn: 900 });
}

export function getPublicUrl(key: string): string {
  return `${PUBLIC_URL}/${key}`;
}
