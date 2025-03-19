// Import necessary testing libraries
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

// Add custom matchers
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});

// Global test timeouts
jest.setTimeout(10000);

// Mock timers
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

// Mock fetch responses
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    ok: true,
    status: 200,
    statusText: 'OK',
  })
);

// Mock Intersection Observer
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

// Error handling for unhandled promises
const originalError = console.error;
console.error = (...args) => {
  if (/Warning.*not wrapped in act/.test(args[0])) {
    return;
  }
  originalError.call(console, ...args);
};

process.on('unhandledRejection', (err) => {
  fail(err);
});

// Add custom environment variables for testing
process.env = {
  ...process.env,
  REACT_APP_API_URL: 'http://localhost:5000',
  NODE_ENV: 'test',
};

// Mock window properties
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    pathname: '/',
    search: '',
    hash: '',
  },
  writable: true,
});

// Add custom test utilities
global.waitFor = (callback, options = {}) => {
  const { timeout = 5000, interval = 50 } = options;
  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    const check = async () => {
      try {
        const result = await callback();
        resolve(result);
      } catch (error) {
        if (Date.now() - startTime > timeout) {
          reject(error);
        } else {
          setTimeout(check, interval);
        }
      }
    };
    check();
  });
};