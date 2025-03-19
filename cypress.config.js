const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    
    setupNodeEvents(on, config) {
      // Implement node event listeners here
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
        table(message) {
          console.table(message);
          return null;
        },
      });
    },
  },

  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack',
    },
    supportFile: 'cypress/support/component.js',
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
  },

  env: {
    apiUrl: 'http://localhost:5000',
    coverage: false,
  },

  retries: {
    runMode: 2,
    openMode: 0,
  },

  defaultCommandTimeout: 10000,
  execTimeout: 60000,
  taskTimeout: 60000,
  pageLoadTimeout: 60000,
  requestTimeout: 10000,
  responseTimeout: 30000,

  viewportPresets: {
    mobile: {
      width: 375,
      height: 667,
    },
    tablet: {
      width: 768,
      height: 1024,
    },
    desktop: {
      width: 1280,
      height: 720,
    },
  },

  // Configure reporters
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
  },

  // Configure screenshots
  screenshotsFolder: 'cypress/screenshots',
  trashAssetsBeforeRuns: true,

  // Configure videos
  videosFolder: 'cypress/videos',
  videoCompression: 32,

  // Configure test files
  testFiles: '**/*.cy.{js,jsx,ts,tsx}',
  fixturesFolder: 'cypress/fixtures',
  downloadsFolder: 'cypress/downloads',

  // Configure Chrome
  chromeWebSecurity: false,
  
  // Configure experimental features
  experimentalSessionAndOrigin: true,
  experimentalSourceRewriting: true,
  experimentalStudio: true,
  experimentalWebKitSupport: true,
});