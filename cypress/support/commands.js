// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Authentication Commands
Cypress.Commands.add('login', (email = Cypress.env('userEmail'), password = Cypress.env('userPassword')) => {
  cy.session([email, password], () => {
    cy.visit('/login');
    cy.get('[data-cy=email-input]').type(email);
    cy.get('[data-cy=password-input]').type(password);
    cy.get('[data-cy=login-button]').click();
    cy.url().should('not.include', '/login');
  });
});

Cypress.Commands.add('loginAsAdmin', () => {
  cy.login(Cypress.env('adminEmail'), Cypress.env('adminPassword'));
});

Cypress.Commands.add('logout', () => {
  cy.get('[data-cy=user-menu]').click();
  cy.get('[data-cy=logout-button]').click();
  cy.url().should('include', '/login');
});

// Shopping Cart Commands
Cypress.Commands.add('addToCart', (productId, quantity = 1) => {
  cy.visit(`/products/${productId}`);
  if (quantity > 1) {
    cy.get('[data-cy=quantity-input]').clear().type(quantity);
  }
  cy.get('[data-cy=add-to-cart-button]').click();
  cy.get('[data-cy=cart-notification]').should('be.visible');
});

Cypress.Commands.add('clearCart', () => {
  cy.visit('/cart');
  cy.get('body').then(($body) => {
    if ($body.find('[data-cy=clear-cart-button]').length) {
      cy.get('[data-cy=clear-cart-button]').click();
      cy.get('[data-cy=confirm-clear-cart]').click();
    }
  });
});

// Product Management Commands
Cypress.Commands.add('createProduct', (productData) => {
  cy.loginAsAdmin();
  cy.visit('/admin/products/new');
  cy.get('[data-cy=product-name]').type(productData.name);
  cy.get('[data-cy=product-description]').type(productData.description);
  cy.get('[data-cy=product-price]').type(productData.price);
  cy.get('[data-cy=product-category]').select(productData.category);
  if (productData.image) {
    cy.get('[data-cy=product-image]').attachFile(productData.image);
  }
  cy.get('[data-cy=submit-product]').click();
});

Cypress.Commands.add('deleteProduct', (productId) => {
  cy.loginAsAdmin();
  cy.visit(`/admin/products/${productId}`);
  cy.get('[data-cy=delete-product]').click();
  cy.get('[data-cy=confirm-delete]').click();
});

// Form Interaction Commands
Cypress.Commands.add('fillForm', (formData) => {
  Object.entries(formData).forEach(([field, value]) => {
    cy.get(`[data-cy=${field}]`).type(value);
  });
});

Cypress.Commands.add('submitForm', () => {
  cy.get('[data-cy=submit-button]').click();
});

// API Interaction Commands
Cypress.Commands.add('interceptApi', (method, url, response) => {
  cy.intercept(method, url, response).as('apiRequest');
});

Cypress.Commands.add('waitForApi', (alias) => {
  cy.wait(`@${alias}`);
});

// UI Interaction Commands
Cypress.Commands.add('clickOutside', () => {
  cy.get('body').click(0, 0);
});

Cypress.Commands.add('dragAndDrop', (dragSelector, dropSelector) => {
  cy.get(dragSelector)
    .trigger('mousedown', { which: 1 })
    .trigger('mousemove', { clientX: 100, clientY: 100 })
    .get(dropSelector)
    .trigger('mousemove')
    .trigger('mouseup');
});

// Viewport Commands
Cypress.Commands.add('viewportPreset', (preset) => {
  const presets = {
    mobile: [375, 667],
    tablet: [768, 1024],
    desktop: [1280, 720]
  };
  
  if (!presets[preset]) {
    throw new Error(`Unknown viewport preset: ${preset}`);
  }
  
  cy.viewport(...presets[preset]);
});

// Local Storage Commands
Cypress.Commands.add('preserveLocalStorage', () => {
  Cypress.Cookies.preserveOnce('token');
  Object.keys(localStorage).forEach(key => {
    cy.setLocalStorage(key, localStorage[key]);
  });
});

Cypress.Commands.add('setLocalStorage', (key, value) => {
  window.localStorage.setItem(key, value);
});

// Custom Assertions
Cypress.Commands.add('shouldBeVisible', { prevSubject: 'element' }, (subject) => {
  cy.wrap(subject).should('be.visible');
});

Cypress.Commands.add('shouldBeEnabled', { prevSubject: 'element' }, (subject) => {
  cy.wrap(subject).should('not.be.disabled');
});

// Error Handling Commands
Cypress.Commands.add('handleError', (callback) => {
  cy.on('uncaught:exception', (err) => {
    callback(err);
    return false;
  });
});

// Accessibility Testing Commands
Cypress.Commands.add('checkA11y', (context, options) => {
  cy.injectAxe();
  cy.checkA11y(context, options);
});

// Custom Wait Commands
Cypress.Commands.add('waitForLoad', () => {
  cy.get('[data-cy=loading-indicator]', { timeout: 10000 }).should('not.exist');
});

Cypress.Commands.add('waitForAnimation', () => {
  cy.wait(500); // Adjust time based on your animation duration
});