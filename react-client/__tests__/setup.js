import "@testing-library/jest-dom";

// Mock for jsdom which lacks URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => "blob:mock-url");
