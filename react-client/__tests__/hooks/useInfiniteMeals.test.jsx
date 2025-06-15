import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useInfiniteMeals from "../../src/hooks/useInfiniteMeals";
import { getMeals } from "../../src/api/meals";

vi.mock("../../src/api/meals", () => ({
  getMeals: vi.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useInfiniteMeals", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches initial page", async () => {
    getMeals.mockResolvedValueOnce(["Meal 1"]);

    const { result } = renderHook(() => useInfiniteMeals(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getMeals).toHaveBeenCalledWith(1);
    expect(result.current.data.pages[0].data).toEqual(["Meal 1"]);
  });

  it("fetches next page when fetchNextPage is called", async () => {
    getMeals
      .mockResolvedValueOnce(["Page 1"]) // First call
      .mockResolvedValueOnce(["Page 2"]); // Next page

    const { result } = renderHook(() => useInfiniteMeals(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => result.current.isSuccess);

    await result.current.fetchNextPage();

    await waitFor(() => {
      expect(result.current.data.pages.length).toBe(2);
    });

    expect(getMeals).toHaveBeenCalledWith(2);
  });

  it("stops fetching after page 10", async () => {
    getMeals.mockImplementation((page) => Promise.resolve([`Page ${page}`]));

    const { result } = renderHook(() => useInfiniteMeals(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => result.current.isSuccess);

    for (let i = 2; i <= 11; i++) {
      await result.current.fetchNextPage();
    }

    expect(getMeals).toHaveBeenCalledTimes(10);
    expect(result.current.hasNextPage).toBe(false);
  });

  it("handles API error", async () => {
    getMeals.mockRejectedValueOnce(new Error("API failed"));

    const { result } = renderHook(() => useInfiniteMeals(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error.message).toBe("API failed");
  });
});
