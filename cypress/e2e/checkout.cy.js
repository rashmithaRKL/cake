describe('Checkout Process', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'Test123!@#'
  };

  const shippingAddress = {
    street: '123 Test St',
    city: 'Test City',
    state: 'TS',
    zipCode: '12345',
    country: 'USA'
  };

  const cardDetails = {
    number: '4242424242424242',
    expiry: '12/25',
    cvc: '123'
  };

  beforeEach(() => {
    // Login and add item to cart before each test
    cy.login(testUser.email, testUser.password);
    cy.visit('/products');
    cy.get('[data-cy=product-card]').first().find('[data-cy=add-to-cart]').click();
    cy.get('[data-cy=cart-button]').click();
    cy.get('[data-cy=checkout-button]').click();
  });

  describe('Shipping Information', () => {
    it('should fill shipping information', () => {
      // Fill shipping form
      cy.get('[data-cy=shipping-street]').type(shippingAddress.street);
      cy.get('[data-cy=shipping-city]').type(shippingAddress.city);
      cy.get('[data-cy=shipping-state]').type(shippingAddress.state);
      cy.get('[data-cy=shipping-zipcode]').type(shippingAddress.zipCode);
      cy.get('[data-cy=shipping-country]').select(shippingAddress.country);

      // Save and continue
      cy.get('[data-cy=shipping-continue]').click();

      // Verify navigation to next step
      cy.get('[data-cy=payment-section]').should('be.visible');
    });

    it('should validate required shipping fields', () => {
      // Try to continue without filling fields
      cy.get('[data-cy=shipping-continue]').click();

      // Verify validation messages
      cy.get('[data-cy=shipping-street-error]').should('be.visible');
      cy.get('[data-cy=shipping-city-error]').should('be.visible');
      cy.get('[data-cy=shipping-state-error]').should('be.visible');
      cy.get('[data-cy=shipping-zipcode-error]').should('be.visible');
    });

    it('should save shipping address for future use', () => {
      // Fill shipping form
      cy.get('[data-cy=shipping-street]').type(shippingAddress.street);
      cy.get('[data-cy=shipping-city]').type(shippingAddress.city);
      cy.get('[data-cy=shipping-state]').type(shippingAddress.state);
      cy.get('[data-cy=shipping-zipcode]').type(shippingAddress.zipCode);
      cy.get('[data-cy=shipping-country]').select(shippingAddress.country);

      // Save address
      cy.get('[data-cy=save-address]').check();
      cy.get('[data-cy=shipping-continue]').click();

      // Start new checkout and verify saved address
      cy.visit('/checkout');
      cy.get('[data-cy=saved-addresses]').should('contain', shippingAddress.street);
    });
  });

  describe('Delivery Options', () => {
    beforeEach(() => {
      // Fill shipping info before testing delivery options
      cy.fillShippingInfo(shippingAddress);
    });

    it('should select delivery method', () => {
      // Select standard delivery
      cy.get('[data-cy=delivery-standard]').check();
      cy.get('[data-cy=delivery-cost]').should('contain', '$5.00');

      // Select express delivery
      cy.get('[data-cy=delivery-express]').check();
      cy.get('[data-cy=delivery-cost]').should('contain', '$15.00');

      cy.get('[data-cy=delivery-continue]').click();
    });

    it('should show delivery date estimates', () => {
      cy.get('[data-cy=delivery-standard]').check();
      cy.get('[data-cy=delivery-estimate]').should('be.visible');
    });

    it('should validate delivery time slots', () => {
      cy.get('[data-cy=delivery-standard]').check();
      cy.get('[data-cy=time-slot-select]').should('be.visible');
      cy.get('[data-cy=delivery-continue]').click();
      cy.get('[data-cy=time-slot-error]').should('be.visible');
    });
  });

  describe('Payment Process', () => {
    beforeEach(() => {
      // Complete shipping and delivery before payment tests
      cy.fillShippingInfo(shippingAddress);
      cy.selectDeliveryMethod('standard');
    });

    it('should process card payment successfully', () => {
      // Fill card details
      cy.get('[data-cy=card-number]').type(cardDetails.number);
      cy.get('[data-cy=card-expiry]').type(cardDetails.expiry);
      cy.get('[data-cy=card-cvc]').type(cardDetails.cvc);

      // Submit payment
      cy.get('[data-cy=submit-payment]').click();

      // Verify success
      cy.get('[data-cy=payment-success]').should('be.visible');
      cy.url().should('include', '/order-confirmation');
    });

    it('should handle invalid card details', () => {
      // Test with invalid card
      cy.get('[data-cy=card-number]').type('4242424242424241');
      cy.get('[data-cy=card-expiry]').type('12/25');
      cy.get('[data-cy=card-cvc]').type('123');

      cy.get('[data-cy=submit-payment]').click();

      cy.get('[data-cy=payment-error]')
        .should('be.visible')
        .and('contain', 'Your card number is invalid');
    });

    it('should save card for future use', () => {
      cy.get('[data-cy=card-number]').type(cardDetails.number);
      cy.get('[data-cy=card-expiry]').type(cardDetails.expiry);
      cy.get('[data-cy=card-cvc]').type(cardDetails.cvc);
      
      cy.get('[data-cy=save-card]').check();
      cy.get('[data-cy=submit-payment]').click();

      // Verify card saved
      cy.visit('/checkout');
      cy.get('[data-cy=saved-cards]').should('contain', '****4242');
    });
  });

  describe('Order Review', () => {
    beforeEach(() => {
      // Complete shipping and delivery
      cy.fillShippingInfo(shippingAddress);
      cy.selectDeliveryMethod('standard');
    });

    it('should display order summary correctly', () => {
      // Verify order details
      cy.get('[data-cy=order-summary]').within(() => {
        cy.get('[data-cy=subtotal]').should('be.visible');
        cy.get('[data-cy=shipping-cost]').should('be.visible');
        cy.get('[data-cy=tax]').should('be.visible');
        cy.get('[data-cy=total]').should('be.visible');
      });
    });

    it('should apply discount code', () => {
      cy.get('[data-cy=discount-code]').type('TESTCODE');
      cy.get('[data-cy=apply-discount]').click();

      cy.get('[data-cy=discount-amount]').should('be.visible');
      cy.get('[data-cy=total]').should('contain', 'Discounted price');
    });

    it('should handle invalid discount code', () => {
      cy.get('[data-cy=discount-code]').type('INVALID');
      cy.get('[data-cy=apply-discount]').click();

      cy.get('[data-cy=discount-error]')
        .should('be.visible')
        .and('contain', 'Invalid discount code');
    });
  });

  describe('Order Confirmation', () => {
    beforeEach(() => {
      // Complete full checkout process
      cy.completeCheckout(shippingAddress, cardDetails);
    });

    it('should display order confirmation details', () => {
      cy.get('[data-cy=order-confirmation]').within(() => {
        cy.get('[data-cy=order-number]').should('be.visible');
        cy.get('[data-cy=order-date]').should('be.visible');
        cy.get('[data-cy=order-total]').should('be.visible');
      });
    });

    it('should send confirmation email', () => {
      // Verify confirmation message
      cy.get('[data-cy=email-confirmation]')
        .should('be.visible')
        .and('contain', testUser.email);
    });

    it('should show order in user account', () => {
      cy.visit('/account/orders');
      cy.get('[data-cy=order-history]')
        .should('contain', cy.get('[data-cy=order-number]'));
    });
  });

  describe('Error Handling', () => {
    it('should handle payment processing errors', () => {
      cy.fillShippingInfo(shippingAddress);
      cy.selectDeliveryMethod('standard');

      // Simulate payment error
      cy.intercept('POST', '/api/payment/process', {
        statusCode: 500,
        body: { error: 'Payment processing failed' }
      });

      cy.get('[data-cy=submit-payment]').click();
      cy.get('[data-cy=payment-error]').should('be.visible');
    });

    it('should handle network errors', () => {
      cy.fillShippingInfo(shippingAddress);
      cy.selectDeliveryMethod('standard');

      // Simulate network error
      cy.intercept('POST', '/api/orders', {
        forceNetworkError: true
      });

      cy.get('[data-cy=submit-payment]').click();
      cy.get('[data-cy=network-error]').should('be.visible');
    });

    it('should prevent double submission', () => {
      cy.fillShippingInfo(shippingAddress);
      cy.selectDeliveryMethod('standard');

      cy.get('[data-cy=submit-payment]').click();
      cy.get('[data-cy=submit-payment]').should('be.disabled');
    });
  });
});