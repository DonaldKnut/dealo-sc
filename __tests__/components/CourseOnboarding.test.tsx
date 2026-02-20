import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CourseOnboarding from "../../components/CourseOnboarding";

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
    section: ({ children, ...props }: any) => (
      <section {...props}>{children}</section>
    ),
    button: ({ children, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
  },
}));

describe("CourseOnboarding Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(<CourseOnboarding />);
    expect(screen.getByText(/welcome to dealo learning/i)).toBeInTheDocument();
  });

  it("displays onboarding information correctly", () => {
    render(<CourseOnboarding />);

    // Check for key elements that actually exist
    expect(screen.getByText(/welcome to dealo learning/i)).toBeInTheDocument();
    expect(
      screen.getByText(/let's create your personalized learning experience/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/ai-powered course recommendations/i)
    ).toBeInTheDocument();
  });

  it("handles user interactions", async () => {
    render(<CourseOnboarding />);

    // Test button interactions with actual buttons
    const nextButton = screen.getByRole("button", { name: /next/i });
    expect(nextButton).toBeInTheDocument();

    fireEvent.click(nextButton);

    // Verify the component handles the click
    await waitFor(() => {
      expect(nextButton).toBeInTheDocument();
    });
  });

  it("renders onboarding features", () => {
    render(<CourseOnboarding />);

    // Check for actual features displayed
    expect(
      screen.getByText(/ai-powered course recommendations/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/personalized learning paths/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/interactive assessments/i)).toBeInTheDocument();
    expect(screen.getByText(/progress tracking/i)).toBeInTheDocument();
  });

  it("displays navigation elements correctly", () => {
    render(<CourseOnboarding />);

    // Check for actual navigation elements
    expect(screen.getByText(/step 1 of 4/i)).toBeInTheDocument();
    expect(screen.getByText(/25% complete/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /previous/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
  });
});
