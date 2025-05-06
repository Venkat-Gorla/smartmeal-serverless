// some helper functions for testing

import FormData from "form-data";
import { basename } from "path";
import { createReadStream } from "fs";
import mime from "mime-types";
import { PassThrough } from "stream";

/**
 * Create a mock Lambda event with multipart/form-data using form-data package.
 * If the optional filePath is provided, it will read the file from the filesystem.
 * Otherwise, it will create a fake file with the provided content.
 */
export async function createEventWithFileInput(
  title,
  description,
  {
    filePath,
    filename = "test.jpg",
    fileContent = "fake image content",
    contentType = "image/jpeg",
  } = {}
) {
  const form = new FormData();
  form.append("title", title);
  form.append("description", description);

  appendFileToForm(form, { filePath, filename, fileContent, contentType });

  return createEventFromForm(form);
}

function appendFileToForm(
  form,
  { filePath, filename, fileContent, contentType }
) {
  if (filePath) {
    const realFileName = basename(filePath);
    const realMime = mime.lookup(filePath) || "application/octet-stream";
    form.append("file", createReadStream(filePath), {
      filename: realFileName,
      contentType: realMime,
    });
  } else {
    form.append("file", Buffer.from(fileContent), {
      filename,
      contentType,
    });
  }
}

async function createEventFromForm(form) {
  const stream = new PassThrough();
  form.pipe(stream);

  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  const buffer = Buffer.concat(chunks);
  const headers = form.getHeaders(); // includes the correct content-type with boundary

  return {
    headers,
    body: buffer.toString("base64"),
    isBase64Encoded: true,
  };
}
