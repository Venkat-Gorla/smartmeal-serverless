const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png"];
export const MAX_FILE_SIZE = 300 * 1024; // 300KB

export function getExtension(mimeType) {
  if (mimeType === "image/jpeg") return ".jpg";
  if (mimeType === "image/png") return ".png";
  throw new Error(`Unsupported MIME type: ${mimeType}`);
}

export function validateFile(file) {
  // vegorla
  // user given filename can be part of metadata
  if (!file || !file.buffer || !file.filename || !file.mimeType) {
    throw new Error("Invalid file upload");
  }

  if (!ALLOWED_MIME_TYPES.includes(file.mimeType)) {
    throw Object.assign(new Error("Unsupported file type"), {
      statusCode: 400,
    });
  }

  if (file.buffer.length > MAX_FILE_SIZE) {
    throw Object.assign(new Error("File too large (max 300KB)"), {
      statusCode: 400,
    });
  }
}
