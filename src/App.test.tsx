import { describe, it, expect } from "bun:test";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Test wrapper with MemoryRouter for controlled routing in tests
const TestApp = ({ initialRoute = "/" }: { initialRoute?: string }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MemoryRouter initialEntries={[initialRoute]}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MemoryRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

describe("App Routing", () => {
  it("renders the Index page on root route", () => {
    render(<TestApp initialRoute="/" />);
    expect(screen.getByText(/React Frontend Template/i)).toBeInTheDocument();
  });

  it("renders NotFound page for unknown routes", () => {
    render(<TestApp initialRoute="/non-existent-route" />);
    expect(screen.getByText(/404/i)).toBeInTheDocument();
  });

  it("renders NotFound page with error message", () => {
    render(<TestApp initialRoute="/unknown" />);
    expect(screen.getByText(/Oops! Page not found/i)).toBeInTheDocument();
  });
});
