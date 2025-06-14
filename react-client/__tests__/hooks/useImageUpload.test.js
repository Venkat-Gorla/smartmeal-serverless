import { renderHook, act } from "@testing-library/react";
import useImageUpload from "../../src/hooks/useImageUpload";

function createMockFile(name, type, sizeKB) {
  const file = new File(["a".repeat(sizeKB * 1024)], name, { type });
  return file;
}

describe("useImageUpload", () => {
  it("should accept valid image and generate preview", () => {
    const { result } = renderHook(() => useImageUpload({}));
    const file = createMockFile("test.jpg", "image/jpeg", 100);
    const e = { target: { files: [file] } };

    act(() => {
      result.current.handleImageChange(e);
    });

    expect(result.current.image).toBe(file);
    expect(result.current.preview).toMatch(/^blob:/);
    expect(result.current.error).toBe("");
  });

  it("should reject unsupported file type", () => {
    const { result } = renderHook(() => useImageUpload({}));
    const file = createMockFile("test.pdf", "application/pdf", 100);
    const e = { target: { files: [file] } };

    act(() => {
      result.current.handleImageChange(e);
    });

    expect(result.current.image).toBe(null);
    expect(result.current.preview).toBe(null);
    expect(result.current.error).toBe("Only JPG and PNG files are allowed.");
  });

  it("should reject image larger than maxSizeKB", () => {
    const { result } = renderHook(() => useImageUpload({ maxSizeKB: 150 }));
    const file = createMockFile("test.png", "image/png", 200);
    const e = { target: { files: [file] } };

    act(() => {
      result.current.handleImageChange(e);
    });

    expect(result.current.image).toBe(null);
    expect(result.current.preview).toBe(null);
    expect(result.current.error).toBe(
      "Image must be less than or equal to 150 KB."
    );
  });

  it("should clear all state on clearImage", () => {
    const { result } = renderHook(() => useImageUpload({}));
    const file = createMockFile("test.jpg", "image/jpeg", 100);
    const e = { target: { files: [file] } };

    act(() => {
      result.current.handleImageChange(e);
    });

    act(() => {
      result.current.clearImage();
    });

    expect(result.current.image).toBe(null);
    expect(result.current.preview).toBe(null);
    expect(result.current.error).toBe("");
  });
});
