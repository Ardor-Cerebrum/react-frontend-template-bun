# Testing Guide

This directory contains the testing infrastructure for the React Frontend Template (Bun version).

## Structure

```
src/__tests__/
├── fixtures/          # Reusable test data and mocks
│   └── index.ts      # Common fixtures (mockUser, mockApiResponse, etc.)
├── utils/            # Test utilities and helpers
│   └── test-utils.tsx # Custom render function with providers
└── setupTests.ts     # Global test setup and mocks
```

## Quick Start

### Running Tests

```bash
# Run tests once
bun test

# Run tests in watch mode (recommended for development)
bun test --watch

# Run tests with coverage report
bun test --coverage
```

## Writing Tests

### Using the Custom Render Function

Always use the custom `render` function from `test-utils.tsx` instead of the default one from `@testing-library/react`. This ensures your components have access to all necessary providers (QueryClient, Router, etc.).

```tsx
import { render, screen } from '@/__tests__/utils/test-utils';
import MyComponent from './MyComponent';

test('renders component', () => {
  render(<MyComponent />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

### Using Fixtures

Use fixtures from `fixtures/index.ts` for consistent test data:

```tsx
import { mockUser } from '@/__tests__/fixtures';
import UserProfile from './UserProfile';

test('displays user information', () => {
  render(<UserProfile user={mockUser} />);
  expect(screen.getByText(mockUser.name)).toBeInTheDocument();
});
```

### Testing Components with React Query

When testing components that use React Query, the QueryClient is already configured in the test utilities:

```tsx
import { render, screen, waitFor } from '@/__tests__/utils/test-utils';
import { QueryClient } from '@tanstack/react-query';
import { createTestQueryClient } from '@/__tests__/fixtures';

test('fetches and displays data', async () => {
  render(<DataComponent />);
  
  await waitFor(() => {
    expect(screen.getByText('Loaded data')).toBeInTheDocument();
  });
});
```

### Testing Router Components

The test utilities include BrowserRouter, so you can test navigation:

```tsx
import { render, screen } from '@/__tests__/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { Link } from 'react-router-dom';

test('navigates to page', async () => {
  const user = userEvent.setup();
  render(<Link to="/about">About</Link>);
  
  await user.click(screen.getByText('About'));
  // Navigation is handled automatically
});
```

## Best Practices

1. **Use descriptive test names**: Test names should clearly describe what is being tested
2. **Arrange-Act-Assert**: Structure your tests with clear sections
3. **Use data-testid sparingly**: Prefer accessible queries (getByRole, getByLabelText, etc.)
4. **Keep tests focused**: Each test should verify one behavior
5. **Use fixtures**: Reuse mock data through fixtures for consistency
6. **Test user interactions**: Use `@testing-library/user-event` for realistic user interactions

## Example Test Template

```tsx
import { describe, it, expect, mock } from 'bun:test';
import { render, screen } from '@/__tests__/utils/test-utils';
import userEvent from '@testing-library/user-event';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles user interaction', async () => {
    const handleClick = mock(() => {});
    const user = userEvent.setup();
    
    render(<MyComponent onClick={handleClick} />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Mocking with Bun

Bun provides Jest-compatible mocking utilities:

```tsx
import { mock, spyOn } from 'bun:test';

// Create a mock function
const mockFn = mock(() => 'return value');

// Spy on an existing method
const consoleSpy = spyOn(console, 'log');

// Mock implementation
mockFn.mockImplementation(() => 'new value');
mockFn.mockReturnValue('static value');
mockFn.mockResolvedValue('async value');

// Assertions
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledTimes(1);
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
```

## Coverage

Coverage reports are generated when running `bun test --coverage`. Aim for:
- High coverage on critical business logic
- Component rendering and user interactions
- Error handling paths

## Additional Resources

- [Bun Test Documentation](https://bun.sh/docs/cli/test)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Happy DOM](https://github.com/capricorn86/happy-dom)
