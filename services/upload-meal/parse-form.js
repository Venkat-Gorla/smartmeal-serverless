import Busboy from "busboy";

export function parseMultipartFormData(event) {
  return new Promise((resolve, reject) =>
    parseFormHelper(event, resolve, reject)
  );
}

function parseFormHelper(event, resolve, reject) {
  const contentType =
    event.headers["content-type"] || event.headers["Content-Type"];
  // vegorla: content-type validation

  const busboy = new Busboy({ headers: { "content-type": contentType } });

  const fields = {};
  let fileBuffer = null;
  let fileInfo = {};

  busboy.on("field", (fieldname, val) => {
    fields[fieldname] = val;
  });

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    const chunks = [];

    file.on("data", (data) => chunks.push(data));
    file.on("end", () => {
      fileBuffer = Buffer.concat(chunks);
      fileInfo = { filename, mimetype };
    });
  });

  busboy.on("finish", () => {
    // vegorla: parsed output validation
    resolve({ fields, file: { ...fileInfo, buffer: fileBuffer } });
  });

  busboy.on("error", reject);

  const bodyBuffer = Buffer.from(
    event.body,
    // vegorla can we assume this prop is set for Lambda invocation?
    event.isBase64Encoded ? "base64" : "utf8"
  );
  busboy.end(bodyBuffer);
}
