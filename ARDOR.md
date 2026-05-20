# Ardor React Frontend Template (Bun) Documentation

## Introduction

This document provides comprehensive guidance for AI agents and developers on using and extending the Ardor React Frontend Template with Bun runtime. This template is designed as a modern, production-ready starting point for React applications, incorporating best practices for scalability, maintainability, and developer experience.

The template integrates Bun runtime, TypeScript, Vite, Tailwind CSS, shadcn/ui components, and other industry-standard tools to accelerate development while maintaining high code quality.

## Project Overview

The Ardor template is a full-stack-ready frontend application template that emphasizes:

- **Type Safety**: Strict TypeScript configuration
- **Performance**: Ultra-fast builds with Bun + Vite
- **Accessibility**: shadcn/ui components built on Radix UI primitives
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Developer Experience**: Hot reload, linting, and comprehensive tooling
- **Scalability**: Modular architecture with clear separation of concerns

## Tech Stack

### Core Technologies
- **Bun**: Ultra-fast JavaScript runtime and package manager
- **React 18**: Latest React with concurrent features and hooks
- **TypeScript 5.8+**: Strict type checking and modern JavaScript features
- **Vite 5.4+**: Fast build tool with native ES modules support

### Styling & UI
- **Tailwind CSS 3.4+**: Utility-first CSS framework
- **shadcn/ui**: High-quality, accessible component library
- **Radix UI**: Unstyled, accessible UI primitives
- **Lucide React**: Modern icon library

### State Management & Data
- **TanStack Query (React Query)**: Powerful data fetching and caching
- **React Hook Form**: Performant forms with easy validation
- **Zod**: TypeScript-first schema validation

### Development Tools
- **ESLint**: Code linting with TypeScript support
- **PostCSS**: CSS processing with Autoprefixer
- **TypeScript ESLint**: TypeScript-specific linting rules

### Testing
- **Bun Test**: Native, Jest-compatible test runner
- **React Testing Library**: DOM testing utilities
- **Happy DOM**: Fast DOM implementation for testing

### Additional Libraries
- **React Router DOM**: Client-side routing
- **next-themes**: Theme switching (light/dark mode)
- **Sonner**: Toast notifications
- **date-fns**: Modern date utility library
- **class-variance-authority**: Component variant management
- **tailwind-merge**: Intelligent class merging

## Project Structure

```
/
├── src/
│   ├── components/
│   │   ├── ui/           # shadcn/ui components
│   │   └── ...           # Custom components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and configuration
│   ├── pages/            # Route components
│   ├── __tests__/        # Test utilities and setup
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # React entry point
│   └── index.css         # Global styles and CSS variables
├── public/               # Static assets
├── Dockerfile            # Containerization (Bun-based)
├── bunfig.toml           # Bun configuration
├── nginx.conf            # Production server config
├── package.json          # Dependencies and scripts
├── vite.config.ts        # Vite configuration
├── tsconfig*.json        # TypeScript configurations
├── tailwind.config.ts    # Tailwind CSS configuration
├── eslint.config.js      # ESLint configuration
├── components.json       # shadcn/ui configuration
└── .env.example          # Environment variables template
```

## Configuration Files

### Bun Configuration (`bunfig.toml`)
- **Test Preload**: Setup files for test environment
- **Coverage**: Built-in coverage reporting

### Vite Configuration (`vite.config.ts`)
- **Path Aliases**: `@/` maps to `./src/`
- **Server Config**: Host `0.0.0.0`, port from `PORT` env var
- **React Plugin**: Uses SWC for faster compilation
- **Build Optimization**: Tree shaking and minification enabled

### TypeScript Configuration
- **Base Config** (`tsconfig.json`): Project references and path mapping
- **App Config** (`tsconfig.app.json`): React application settings
- **Node Config** (`tsconfig.node.json`): Build tools configuration
- **Strict Mode**: Disabled for flexibility, but recommended to enable for production

### Tailwind CSS Configuration (`tailwind.config.ts`)
- **Dark Mode**: Class-based theme switching
- **Content Paths**: Scans `src/**/*.{ts,tsx}` for classes
- **Custom Colors**: Extends with CSS variables for theming
- **Animations**: Custom keyframes for smooth transitions

### ESLint Configuration (`eslint.config.js`)
- **Rules**: React hooks and refresh plugins
- **Ignores**: `dist/` directory excluded
- **TypeScript**: Full TypeScript support with recommended rules

### shadcn/ui Configuration (`components.json`)
- **Style**: Default theme
- **TSX**: Enabled for TypeScript
- **Aliases**: Pre-configured for components, utils, hooks

## Source Code Organization

### Entry Point (`src/main.tsx`)
Standard React 18 entry point using `createRoot`. Imports global CSS and renders the App component.

### App Component (`src/App.tsx`)
Central application component providing:
- **QueryClientProvider**: React Query context
- **TooltipProvider**: Global tooltip context
- **Toaster Components**: Notification systems (shadcn/ui and Sonner)
- **BrowserRouter**: Client-side routing setup
- **Route Configuration**: Index and 404 routes

### Pages (`src/pages/`)
- **Index.tsx**: Landing/home page
- **NotFound.tsx**: 404 error page with logging
- **Routing Convention**: Add new routes above the catch-all `*` route

### Components (`src/components/`)
- **ui/**: shadcn/ui components (do not modify directly)
- **Custom Components**: Place in subdirectories or root of components/
- **Naming**: PascalCase for component files and directories

### Hooks (`src/hooks/`)
- **use-mobile.tsx**: Responsive breakpoint detection
- **use-toast.ts**: Toast notification hook (from shadcn/ui)
- **Custom Hooks**: Place additional hooks here

### Utilities (`src/lib/`)
- **utils.ts**: `cn()` function for class merging
- **config.ts**: Environment configuration and constants
- **Additional Utils**: Database helpers, API clients, etc.

## Styling and Theming

### CSS Variables (`src/index.css`)
- **Design System**: All colors defined as HSL values
- **Themes**: Light and dark mode variants
- **Custom Properties**: Gradients, shadows, transitions
- **Base Styles**: Global typography and resets

### Tailwind Integration
- **Utility Classes**: Direct application in JSX
- **Custom Classes**: Use `@layer components` for reusable styles
- **Responsive Design**: Mobile-first with `sm:`, `md:`, `lg:` prefixes

### Theme Switching
- Uses `next-themes` for persistent theme storage
- CSS variables automatically update based on `class="dark"`
- Components adapt automatically to theme changes

## Components and UI

### shadcn/ui Components
Pre-installed components include:
- Form controls (Button, Input, Select, etc.)
- Layout (Card, Sheet, Dialog, etc.)
- Navigation (Tabs, Breadcrumb, etc.)
- Feedback (Toast, Alert, Progress, etc.)
- Data display (Table, Chart, etc.)

### Adding New Components
```bash
bunx shadcn-ui@latest add [component-name]
```

### Component Patterns
- **Composition**: Use `children` and render props
- **Variants**: Use `class-variance-authority` for style variants
- **Forward Refs**: For form controls and focus management
- **TypeScript**: Strict typing for props and events

## Hooks and Utilities

### Custom Hooks
- **useIsMobile**: Returns boolean for mobile breakpoint (< 768px)
- **Toast Hooks**: From shadcn/ui for notifications

### Utility Functions
- **cn()**: Merges Tailwind classes intelligently
- **Configuration**: Type-safe environment access

### Best Practices
- **Custom Hooks**: Extract reusable logic from components
- **Memoization**: Use `useMemo` and `useCallback` for performance
- **Side Effects**: Prefer React Query for server state

## Pages and Routing

### Route Structure
- **Flat Routing**: All routes defined in `App.tsx`
- **Index Route**: `/` maps to `Index` component
- **404 Handling**: Catch-all route with `NotFound` component

### Adding New Routes
1. Create page component in `src/pages/`
2. Import in `App.tsx`
3. Add `<Route path="/new-route" element={<NewPage />} />`
4. Place above the `*` catch-all route

### Navigation
- Use `Link` from `react-router-dom` for internal navigation
- Use `useNavigate` hook for programmatic navigation
- Use `useLocation` for current route information

## Build and Deployment

### Development
```bash
bun run dev  # Start dev server on port 8080
```

### Production Build
```bash
bun run build       # Production build
bun run build:dev   # Development build
bun run preview     # Preview production build
```

### Docker Deployment
- **Dockerfile**: Multi-stage build with Bun and Nginx
- **nginx.conf**: Optimized for SPA routing and caching
- **Environment**: Configurable via `PORT` environment variable

### Static Hosting
- **Vercel/Netlify**: Direct deployment of `dist/` folder
- **GitHub Pages**: Use build output
- **SPA Routing**: Server configured for client-side routing

## Testing

### Test Framework
This template uses Bun's built-in test runner with Jest-compatible API.

### Running Tests
```bash
bun test              # Run tests once
bun test --watch      # Watch mode
bun test --coverage   # With coverage report
```

### Test Setup
- **Happy DOM**: Fast DOM simulation (configured in `bunfig.toml`)
- **Setup File**: `src/__tests__/setupTests.ts` runs before all tests
- **Custom Render**: Wraps components with providers

### Writing Tests
```typescript
import { describe, it, expect, mock } from "bun:test";
import { render, screen } from "@/__tests__/utils/test-utils";

describe("MyComponent", () => {
  it("renders correctly", () => {
    render(<MyComponent />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("handles click", async () => {
    const handleClick = mock(() => {});
    render(<MyComponent onClick={handleClick} />);
    // test interaction
  });
});
```

## Development Workflow

### Code Quality
- **Linting**: `bun run lint` with ESLint
- **Type Checking**: Integrated with TypeScript
- **Formatting**: Consistent with Prettier (via ESLint)

### Environment Variables
- **Prefix**: All client variables must start with `VITE_`
- **Access**: Use `import.meta.env.VITE_*`
- **Configuration**: Centralized in `src/lib/config.ts`

### Git Workflow
- **Branching**: Feature branches from `main`
- **Commits**: Conventional commit messages
- **PRs**: Code review required

## Best Practices for Extension

### Component Development
1. **Start with shadcn/ui**: Check if component exists
2. **Type Safety**: Define strict prop interfaces
3. **Accessibility**: Use Radix primitives for a11y
4. **Responsive**: Mobile-first design
5. **Performance**: Memoize expensive operations

### State Management
1. **Local State**: `useState` for component state
2. **Server State**: React Query for API data
3. **Global State**: Context or Zustand for app-wide state
4. **Forms**: React Hook Form with Zod validation

### API Integration
1. **React Query**: For data fetching and mutations
2. **Error Handling**: Use error boundaries and toast notifications
3. **Loading States**: Skeleton components and loading indicators
4. **Caching**: Leverage React Query's intelligent caching

### Styling Guidelines
1. **Tailwind First**: Use utility classes
2. **CSS Variables**: For theme values
3. **Component Variants**: Use CVA for style variations
4. **Dark Mode**: Automatic support via CSS variables

### File Organization
1. **Feature Folders**: Group related files
2. **Index Files**: Barrel exports for clean imports
3. **Type Definitions**: Colocate with components
4. **Constants**: Group in `lib/` or feature folders

### Performance Optimization
1. **Code Splitting**: Lazy load routes and heavy components
2. **Bundle Analysis**: Monitor bundle size
3. **Image Optimization**: Use appropriate formats and sizes
4. **Memoization**: Prevent unnecessary re-renders

## Examples

### Adding a New Page
```tsx
// src/pages/Dashboard.tsx
const Dashboard = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      {/* Page content */}
    </div>
  );
};

export default Dashboard;
```

```tsx
// src/App.tsx (add route)
import Dashboard from "./pages/Dashboard";

// Inside Routes:
<Route path="/dashboard" element={<Dashboard />} />
```

### Creating a Custom Component
```tsx
// src/components/CustomButton.tsx
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CustomButtonProps extends ButtonProps {
  variant?: "primary" | "secondary";
}

export const CustomButton = ({ 
  className, 
  variant = "primary", 
  ...props 
}: CustomButtonProps) => {
  return (
    <Button
      className={cn(
        variant === "primary" && "bg-primary hover:bg-primary/90",
        variant === "secondary" && "bg-secondary hover:bg-secondary/90",
        className
      )}
      {...props}
    />
  );
};
```

### Using React Query
```tsx
// src/hooks/useUser.ts
import { useQuery } from "@tanstack/react-query";

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const response = await fetch(`${config.apiBaseUrl}/users/${id}`);
      return response.json();
    },
  });
};
```

### Form with Validation
```tsx
// src/components/LoginForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type LoginForm = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    console.log(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Input {...form.register("email")} placeholder="Email" />
      <Input {...form.register("password")} type="password" placeholder="Password" />
      <Button type="submit">Login</Button>
    </form>
  );
};
```

### Writing Tests with Bun
```typescript
// src/components/MyComponent.test.tsx
import { describe, it, expect, mock, spyOn } from "bun:test";
import { render, screen } from "@/__tests__/utils/test-utils";
import userEvent from "@testing-library/user-event";
import { MyComponent } from "./MyComponent";

describe("MyComponent", () => {
  it("renders correctly", () => {
    render(<MyComponent />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("handles click events", async () => {
    const handleClick = mock(() => {});
    const user = userEvent.setup();
    
    render(<MyComponent onClick={handleClick} />);
    await user.click(screen.getByRole("button"));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("spies on console", () => {
    const consoleSpy = spyOn(console, "log");
    render(<MyComponent />);
    expect(consoleSpy).toHaveBeenCalled();
  });
});
```

## Troubleshooting

### Common Issues

**Build Errors**
- Check TypeScript errors: `bunx tsc --noEmit`
- Verify dependencies: `bun install`
- Clear cache: `rm -rf node_modules/.vite`

**Styling Issues**
- Verify Tailwind classes are in content paths
- Check CSS variable definitions
- Ensure dark mode class is applied to html/body

**Component Issues**
- Verify shadcn/ui installation: `bunx shadcn-ui@latest diff`
- Check Radix UI peer dependencies
- Ensure proper TypeScript types

**Routing Issues**
- Confirm routes are added above catch-all
- Check BrowserRouter wrapping
- Verify component exports

**Test Issues**
- Ensure Happy DOM is properly configured
- Check that `bunfig.toml` has correct preload path
- Verify mock functions use `mock()` from `bun:test`

### Performance Issues
- Use React DevTools Profiler
- Check bundle size with `bun run build`
- Optimize images and assets
- Implement code splitting for large components

### Environment Issues
- Verify `VITE_` prefix on client variables
- Check `.env` file location (project root)
- Restart dev server after env changes

## Why Bun?

### Speed Benefits
- **Package Installation**: Up to 25x faster than npm
- **Script Execution**: Native TypeScript execution
- **Test Runner**: Built-in, Jest-compatible, extremely fast

### Developer Experience
- **Single Tool**: Runtime, bundler, test runner, package manager
- **TypeScript Native**: No separate compilation step
- **Modern APIs**: Built-in fetch, WebSocket, and more

### Compatibility
- **npm Ecosystem**: Works with existing packages
- **Node.js APIs**: High compatibility with Node.js code
- **Vite Integration**: Works seamlessly with Vite

This documentation provides a comprehensive foundation for extending the Ardor template with Bun. Follow these guidelines to maintain code quality, performance, and developer experience while building robust React applications.
