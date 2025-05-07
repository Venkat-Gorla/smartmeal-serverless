const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png"];
export const MAX_FILE_SIZE = 300 * 1024; // 300KB

/**
 * Generate a safe, human-readable S3 key for uploaded file.
 * Includes user ID and ISO timestamp.
 */
export function generateS3Key(userId, mimeType) {
  const extension = getFileExtension(mimeType);
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `uploads/${userId}/meal-${timestamp}${extension}`;
}

/**
 * Convert MIME type to file extension or throw for unsupported types
 */
export function getFileExtension(mimeType) {
  if (mimeType === "image/jpeg") return ".jpg";
  if (mimeType === "image/png") return ".png";
  throw errorResponse(`Unsupported MIME type: ${mimeType}`);
}

export function validateFile(file) {
  // vegorla
  // user given filename can be part of metadata
  if (!file || !file.buffer || !file.filename || !file.mimeType) {
    throw errorResponse("Invalid file upload");
  }

  if (!ALLOWED_MIME_TYPES.includes(file.mimeType)) {
    throw errorResponse("Unsupported file type");
  }

  if (file.buffer.length > MAX_FILE_SIZE) {
    throw errorResponse("File too large (max 300KB)");
  }
}

function errorResponse(message, statusCode = 400) {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.body = JSON.stringify({ error: message });
  return err;
}

export function normalizeMetadata(obj) {
  const safeMetadata = {};
  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase().replace(/[^a-z0-9-]/g, "-"); // safe ASCII
    safeMetadata[lowerKey] = String(value);
  }
  return safeMetadata;
}
