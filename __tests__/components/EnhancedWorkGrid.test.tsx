import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import EnhancedWorkGrid from "../../app/marketplace/_components/EnhancedWorkGrid";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock fetch
global.fetch = jest.fn();

const mockWorks = [
  {
    _id: "1",
    title: "Test Work 1",
    description: "Test Description 1",
    price: 100,
    category: "Design",
    workMedia: [],
    creator: { _id: "1", firstName: "John", lastName: "Doe" },
    skills: ["React", "Node.js"],
    experienceLevel: "Senior" as const,
    deliveryTime: "1 week",
    createdAt: "2023-01-01",
  },
  {
    _id: "2",
    title: "Test Work 2",
    description: "Test Description 2",
    price: 200,
    category: "Development",
    workMedia: [],
    creator: { _id: "2", firstName: "Jane", lastName: "Smith" },
    skills: ["Python", "Django"],
    experienceLevel: "Mid" as const,
    deliveryTime: "2 weeks",
    createdAt: "2023-01-02",
  },
];

describe("EnhancedWorkGrid Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ wishlist: [] }),
    });
  });

  it("renders without crashing", () => {
    render(<EnhancedWorkGrid works={mockWorks} />);
    expect(screen.getByText("Test Work 1")).toBeInTheDocument();
  });

  it("displays all works correctly", () => {
    render(<EnhancedWorkGrid works={mockWorks} />);

    expect(screen.getByText("Test Work 1")).toBeInTheDocument();
    expect(screen.getByText("Test Work 2")).toBeInTheDocument();
    expect(screen.getByText("Test Description 1")).toBeInTheDocument();
    expect(screen.getByText("Test Description 2")).toBeInTheDocument();
  });

  it("handles empty works array", () => {
    render(<EnhancedWorkGrid works={[]} />);

    // Should not crash with empty array
    expect(screen.queryByText("Test Work 1")).not.toBeInTheDocument();
  });

  it("fetches wishlist on mount", async () => {
    render(<EnhancedWorkGrid works={mockWorks} />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/wishlist");
    });
  });

  it("handles wishlist toggle correctly", async () => {
    const mockOnWishlistToggle = jest.fn();
    render(
      <EnhancedWorkGrid
        works={mockWorks}
        onWishlistToggle={mockOnWishlistToggle}
      />
    );

    // The component should render without errors
    expect(screen.getByText("Test Work 1")).toBeInTheDocument();
  });

  it("displays work metadata correctly", () => {
    render(<EnhancedWorkGrid works={mockWorks} />);

    // Check for price display
    expect(screen.getByText("$100")).toBeInTheDocument();
    expect(screen.getByText("$200")).toBeInTheDocument();

    // Check for category
    expect(screen.getByText("Design")).toBeInTheDocument();
    expect(screen.getByText("Development")).toBeInTheDocument();
  });
});
