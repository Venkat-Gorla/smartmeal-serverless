import Busboy from "busboy";

// Note: this function will be called by the Lambda handler, all error handling and
// response mapping is supposed to happen there
export function parseMultipartFormData(event) {
  return new Promise((resolve, reject) =>
    parseFormHelper(event, resolve, reject)
  );
}

function parseFormHelper(event, resolve, reject) {
  const contentType =
    event.headers?.["content-type"] || event.headers?.["Content-Type"];

  if (!contentType?.includes("multipart/form-data")) {
    return reject({
      statusCode: 400,
      body: JSON.stringify({ error: "Expected multipart/form-data" }),
    });
  }

  const busboy = Busboy({ headers: { "content-type": contentType } });

  const fields = {};
  let fileBuffer = null;
  let fileInfo = {};

  busboy.on("field", (fieldname, val) => {
    fields[fieldname] = val;
  });

  // vegorla: enforce file size to be some limit?
  busboy.on("file", (fieldname, file, info) => {
    const { filename, encoding, mimeType } = info;
    const chunks = [];

    file.on("data", (data) => chunks.push(data));
    file.on("end", () => {
      fileBuffer = Buffer.concat(chunks);
      fileInfo = { filename, encoding, mimeType };
    });
  });

  busboy.on("finish", () => {
    // vegorla: parsed output validation should happen inside Lambda.
    // this function should be generic
    // if (!file?.mimeType?.startsWith("image/")) {
    //   return {
    //     statusCode: 400,
    //     body: "Invalid file type. Only images allowed.",
    //   };
    // }

    resolve({ fields, file: { ...fileInfo, buffer: fileBuffer } });
  });

  busboy.on("error", reject);

  // Note: event.isBase64Encoded is not guaranteed to be set in all environments.
  // Safely coerce to boolean to ensure proper decoding.
  const isBase64 = !!event.isBase64Encoded;
  const bodyBuffer = Buffer.from(event.body, isBase64 ? "base64" : "utf8");
  busboy.end(bodyBuffer);
}
