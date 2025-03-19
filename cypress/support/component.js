// Import commands.js using ES2015 syntax:
import './commands';

// Import styles
import '../../src/styles/index.css';

// Import React
import React from 'react';
import { mount } from 'cypress/react';

// Import test utilities
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a new QueryClient instance for each test
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

// Add command to mount React components
Cypress.Commands.add('mount', (component, options = {}) => {
  const { routerProps = {}, queryClientProps = {}, ...mountOptions } = options;

  const wrapped = (
    <BrowserRouter {...routerProps}>
      <QueryClientProvider client={queryClient} {...queryClientProps}>
        {component}
      </QueryClientProvider>
    </BrowserRouter>
  );

  return mount(wrapped, mountOptions);
});

// Add custom command for component testing
Cypress.Commands.add('getByCy', (selector) => {
  return cy.get(`[data-cy=${selector}]`);
});

// Add custom command to test component props
Cypress.Commands.add('checkProp', { prevSubject: true }, (subject, prop, value) => {
  expect(subject.prop(prop)).to.equal(value);
});

// Add custom command to simulate events
Cypress.Commands.add('simulateEvent', { prevSubject: true }, (subject, eventName, eventData) => {
  subject.trigger(eventName, eventData);
});

// Add custom command to check component state
Cypress.Commands.add('checkState', { prevSubject: true }, (subject, callback) => {
  callback(subject.state());
});

// Add custom command to wait for component update
Cypress.Commands.add('waitForUpdate', { prevSubject: true }, (subject) => {
  return new Cypress.Promise((resolve) => {
    subject.on('update', resolve);
  });
});

// Add custom command to test accessibility
Cypress.Commands.add('checkComponentA11y', (component) => {
  cy.mount(component);
  cy.injectAxe();
  cy.checkA11y();
});

// Add custom command to test responsive behavior
Cypress.Commands.add('testResponsive', (component, breakpoints) => {
  cy.mount(component);
  
  breakpoints.forEach(({ width, height, assertion }) => {
    cy.viewport(width, height);
    assertion();
  });
});

// Add custom command to test component loading state
Cypress.Commands.add('checkLoadingState', (component, loadingSelector = '[data-cy=loading]') => {
  cy.mount(component);
  cy.get(loadingSelector).should('exist');
});

// Add custom command to test error state
Cypress.Commands.add('checkErrorState', (component, error, errorSelector = '[data-cy=error]') => {
  cy.mount(component);
  cy.get(errorSelector).should('contain', error);
});

// Add custom command to test component lifecycle
Cypress.Commands.add('testLifecycle', (component, lifecycle) => {
  const { mount: mountFn, unmount: unmountFn } = lifecycle;
  
  cy.mount(component).then(mountFn);
  cy.get('@component').then(unmountFn);
});

// Configure global behavior
beforeEach(() => {
  // Reset application state
  queryClient.clear();
});

// Handle uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  return false;
});

// Add custom assertions
chai.Assertion.addMethod('styledWith', function(property, value) {
  const subject = this._obj;
  
  this.assert(
    subject.css(property) === value,
    `expected #{this} to have CSS property "${property}" with value "${value}"`,
    `expected #{this} not to have CSS property "${property}" with value "${value}"`
  );
});

// Add snapshot testing capabilities
Cypress.Commands.add('matchSnapshot', { prevSubject: true }, (subject, name) => {
  cy.wrap(subject).snapshot(name);
});

// Add custom command for testing animations
Cypress.Commands.add('checkAnimation', { prevSubject: true }, (subject, property, from, to) => {
  cy.wrap(subject)
    .should('have.css', property, from)
    .and('have.css', property, to);
});

// Add custom command for testing hover states
Cypress.Commands.add('checkHoverState', { prevSubject: true }, (subject, property, value) => {
  cy.wrap(subject)
    .trigger('mouseover')
    .should('have.css', property, value);
});