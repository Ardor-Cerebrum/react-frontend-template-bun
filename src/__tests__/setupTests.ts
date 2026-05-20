import { GlobalRegistrator } from "@happy-dom/global-registrator";

// Register happy-dom globals BEFORE importing testing library
GlobalRegistrator.register();

import "@testing-library/jest-dom";
import { afterEach, mock } from "bun:test";

// Cleanup after each test - clear DOM manually
afterEach(() => {
  document.body.innerHTML = "";
  document.head.innerHTML = "";
});

// Mock window.matchMedia (used by some Radix UI components)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: mock((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: mock(() => {}), // deprecated
    removeListener: mock(() => {}), // deprecated
    addEventListener: mock(() => {}),
    removeEventListener: mock(() => {}),
    dispatchEvent: mock(() => true),
  })),
});

// Mock IntersectionObserver (used by some components)
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as unknown as typeof IntersectionObserver;
