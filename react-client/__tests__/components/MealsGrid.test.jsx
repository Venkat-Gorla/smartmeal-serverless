import { render, screen, fireEvent } from "@testing-library/react";
import MealsGrid from "../../src/components/MealsGrid";
import * as useInfiniteMealsHook from "../../src/hooks/useInfiniteMeals";

// Mock MealCard component
vi.mock("../../src/components/MealCard", () => ({
  default: ({ meal }) => <div>{meal.name}</div>,
}));

// Stub meals
const sampleMeals = [
  { id: 1, name: "Banana Bread", calories: 250 },
  { id: 2, name: "Apple Pie", calories: 300 },
];

// Utility to create mocked hook values
const mockHookReturn = (overrides = {}) => ({
  data: { pages: [{ data: sampleMeals }] },
  fetchNextPage: vi.fn(),
  hasNextPage: true,
  isFetchingNextPage: false,
  isLoading: false,
  ...overrides,
});

describe("MealsGrid", () => {
  beforeEach(() => {
    vi.spyOn(useInfiniteMealsHook, "default").mockReturnValue(mockHookReturn());
  });

  it("renders all meals by default", () => {
    render(<MealsGrid />);
    for (const meal of sampleMeals) {
      expect(screen.getByText(meal.name)).toBeInTheDocument();
    }
  });

  it("shows no results message if searchTerm excludes all", () => {
    render(<MealsGrid />);
    fireEvent.change(screen.getByPlaceholderText(/search meals/i), {
      target: { value: "xyz" },
    });
    expect(screen.getByText(/no meals found for "xyz"/i)).toBeInTheDocument();
  });

  it("calls fetchNextPage when Load More is clicked", () => {
    const fetchNextPage = vi.fn();
    vi.spyOn(useInfiniteMealsHook, "default").mockReturnValue(
      mockHookReturn({ fetchNextPage })
    );
    render(<MealsGrid />);
    fireEvent.click(screen.getByRole("button", { name: /load more/i }));
    expect(fetchNextPage).toHaveBeenCalled();
  });

  it("shows loading spinner if loading state is true", () => {
    vi.spyOn(useInfiniteMealsHook, "default").mockReturnValue(
      mockHookReturn({ data: { pages: [{ data: [] }] }, isLoading: true })
    );
    render(<MealsGrid />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it('shows "no more meals" if hasNextPage is false', () => {
    vi.spyOn(useInfiniteMealsHook, "default").mockReturnValue(
      mockHookReturn({ hasNextPage: false })
    );
    render(<MealsGrid />);
    expect(screen.getByText(/no more meals/i)).toBeInTheDocument();
  });

  it("shows no meals message when meals data is empty", () => {
    vi.spyOn(useInfiniteMealsHook, "default").mockReturnValue(
      mockHookReturn({ hasNextPage: false, data: { pages: [{ data: [] }] } })
    );
    render(<MealsGrid />);
    expect(screen.getByText(/no more meals/i)).toBeInTheDocument();
  });
});
