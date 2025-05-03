import { describe, it, expect } from "vitest";
import { handler } from "../upload.js";

describe("upload lambda handler tests", () => {
  it("returns 400 if title or description is missing", async () => {
    const event = {
      body: JSON.stringify({ title: "" }), // missing description
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body).error).toBe(
      "title and description required"
    );
  });

  // More tests to follow...
});
