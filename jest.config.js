module.exports = {
  // Test environment
  testEnvironment: 'jsdom',

  // Test files pattern
  testMatch: [
    '<rootDir>/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/**/*.{spec,test}.{js,jsx,ts,tsx}',
  ],

  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.{js,jsx,ts,tsx}',
    '!src/serviceWorker.{js,ts}',
    '!src/reportWebVitals.{js,ts}',
    '!src/setupTests.{js,ts}',
    '!src/stories/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },

  // Module file extensions
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],

  // Module name mapper for handling imports
  moduleNameMapper: {
    // Handle CSS imports (with CSS modules)
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',

    // Handle CSS imports (without CSS modules)
    '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',

    // Handle image imports
    '^.+\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',

    // Handle module aliases
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // Transform configuration
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },

  // Setup files
  setupFiles: ['<rootDir>/jest.setup.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setupAfterEnv.js'],

  // Test timeout
  testTimeout: 10000,

  // Ignore patterns
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/build/',
  ],
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  watchPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.git/',
  ],

  // Globals configuration
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.jest.json',
    },
  },

  // Reporters
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'coverage/junit',
        outputName: 'junit.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: true,
      },
    ],
  ],

  // Watch plugins
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],

  // Other options
  verbose: true,
  clearMocks: true,
  resetMocks: false,
  restoreMocks: false,
  errorOnDeprecated: true,
  bail: 1,
  maxWorkers: '50%',
};