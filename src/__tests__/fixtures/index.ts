/**
 * Common test fixtures and mock data
 * 
 * This file exports reusable fixtures that can be used across tests.
 * Fixtures provide consistent, predictable data structures for testing.
 * 
 * @example
 * ```tsx
 * import { mockUser } from '@/__tests__/fixtures';
 * 
 * test('user component', () => {
 *   render(<UserComponent user={mockUser} />);
 * });
 * ```
 */

// Example: Mock user data
export const mockUser = {
  id: "1",
  name: "Test User",
  email: "test@example.com",
  avatar: "https://example.com/avatar.jpg",
};

// Example: Mock API response
export const mockApiResponse = {
  data: {
    users: [mockUser],
    total: 1,
  },
  status: 200,
  message: "Success",
};

// Example: Mock error response
export const mockErrorResponse = {
  error: {
    message: "Something went wrong",
    code: "ERROR_CODE",
  },
  status: 500,
};

/**
 * Helper to create a QueryClient with default test options
 * Useful when you need a custom QueryClient configuration
 */
import { QueryClient } from "@tanstack/react-query";

export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

