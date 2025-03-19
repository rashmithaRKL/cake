// Polyfills and global mocks that need to run before tests
require('@testing-library/jest-dom');

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }

  observe() {
    return null;
  }

  unobserve() {
    return null;
  }

  disconnect() {
    return null;
  }
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserver,
});

// Mock ResizeObserver
class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }

  observe() {
    return null;
  }

  unobserve() {
    return null;
  }

  disconnect() {
    return null;
  }
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: ResizeObserver,
});

// Mock window.scrollTo
window.scrollTo = jest.fn();

// Mock console methods
global.console = {
  ...console,
  // Uncomment the following lines to see the suppressed console methods in tests
  // log: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  error: jest.fn(),
};

// Mock fetch API
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

// Suppress React 18 console warnings
const originalError = console.error;
console.error = (...args) => {
  if (/Warning.*not wrapped in act/.test(args[0])) {
    return;
  }
  originalError.call(console, ...args);
};