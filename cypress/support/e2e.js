// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests from command log
const app = window.top;
if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
  const style = app.document.createElement('style');
  style.innerHTML =
    '.command-name-request, .command-name-xhr { display: none }';
  style.setAttribute('data-hide-command-log-request', '');
  app.document.head.appendChild(style);
}

// Prevent Cypress from failing tests when application throws uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  return false;
});

// Log all cy.intercept() requests
Cypress.on('log:added', (log) => {
  if (log.displayName === 'xhr' || log.displayName === 'request') {
    console.log(`${log.displayName} to ${log.url}`);
  }
});

// Add custom assertion
chai.Assertion.addMethod('withMessage', function (msg) {
  _.flag(this, 'message', msg);
});

// Configure global behavior
beforeEach(() => {
  // Reset session storage between tests
  sessionStorage.clear();
  
  // Preserve cookies between tests
  Cypress.Cookies.preserveOnce('session_id', 'remember_token');
});

// Global error handling
Cypress.on('fail', (error, runnable) => {
  // we can handle errors here
  console.error('Test failed:', error.message);
  throw error; // still fail the test
});

// Add custom command to check if element is visible and enabled
Cypress.Commands.add('isVisibleAndEnabled', { prevSubject: 'element' }, ($el) => {
  const isVisible = $el.is(':visible');
  const isEnabled = !$el.is(':disabled');
  expect(isVisible).to.be.true;
  expect(isEnabled).to.be.true;
  return $el;
});

// Add custom command to wait for API request to complete
Cypress.Commands.add('waitForApi', (method, url) => {
  cy.intercept(method, url).as('apiRequest');
  cy.wait('@apiRequest');
});

// Add custom command for drag and drop
Cypress.Commands.add('dragAndDrop', (subject, target) => {
  Cypress.log({
    name: 'dragAndDrop',
    message: `Dragging element ${subject} to ${target}`,
    consoleProps: () => ({
      subject,
      target
    })
  });
  
  cy.get(subject).trigger('mousedown', { which: 1 });
  cy.get(target)
    .trigger('mousemove')
    .trigger('mouseup', { force: true });
});

// Add custom command to login
Cypress.Commands.add('login', (email, password) => {
  cy.session([email, password], () => {
    cy.visit('/login');
    cy.get('[data-cy=email-input]').type(email);
    cy.get('[data-cy=password-input]').type(password);
    cy.get('[data-cy=login-button]').click();
    cy.url().should('not.include', '/login');
  });
});

// Add custom command to check accessibility
Cypress.Commands.add('checkA11y', (context, options) => {
  cy.injectAxe();
  cy.checkA11y(context, options);
});

// Configure retry-ability
Cypress.config('retries', {
  runMode: 2,
  openMode: 0
});

// Add custom command for API requests with authentication
Cypress.Commands.add('authenticatedRequest', (options = {}) => {
  const token = window.localStorage.getItem('token');
  return cy.request({
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`
    }
  });
});

// Add viewport presets
const viewports = {
  mobile: [375, 667],
  tablet: [768, 1024],
  desktop: [1280, 720]
};

Cypress.Commands.add('setViewport', (device) => {
  if (!viewports[device]) throw new Error(`Unknown viewport: ${device}`);
  const [width, height] = viewports[device];
  cy.viewport(width, height);
});