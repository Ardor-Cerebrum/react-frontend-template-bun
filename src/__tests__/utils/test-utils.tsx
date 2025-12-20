import { render, type RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ReactElement } from "react";

/**
 * Custom render function that wraps components with all necessary providers.
 * Use this instead of the default render from @testing-library/react to ensure
 * your components have access to all context providers (QueryClient, Router, etc.)
 *
 * @example
 * ```tsx
 * import { render } from '@/__tests__/utils/test-utils';
 *
 * test('my component', () => {
 *   const { getByText } = render(<MyComponent />);
 *   expect(getByText('Hello')).toBeInTheDocument();
 * });
 * ```
 */
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
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
        <BrowserRouter>{children}</BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything from @testing-library/react
export * from "@testing-library/react";
export { customRender as render };

