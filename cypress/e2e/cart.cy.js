describe('Shopping Cart', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'Test123!@#'
  };

  beforeEach(() => {
    // Clear cart and localStorage before each test
    cy.clearLocalStorage();
    cy.visit('/');
  });

  describe('Add to Cart', () => {
    it('should add a product to cart', () => {
      // Navigate to products page
      cy.get('[data-cy=nav-products]').click();

      // Select first product
      cy.get('[data-cy=product-card]').first().within(() => {
        cy.get('[data-cy=product-name]').invoke('text').as('productName');
        cy.get('[data-cy=product-price]').invoke('text').as('productPrice');
        cy.get('[data-cy=add-to-cart]').click();
      });

      // Verify cart notification
      cy.get('[data-cy=cart-notification]')
        .should('be.visible')
        .and('contain', 'Item added to cart');

      // Check cart count
      cy.get('[data-cy=cart-count]')
        .should('be.visible')
        .and('contain', '1');

      // Open cart
      cy.get('[data-cy=cart-button]').click();

      // Verify product in cart
      cy.get('@productName').then(productName => {
        cy.get('[data-cy=cart-item]')
          .should('contain', productName);
      });
    });

    it('should handle quantity selection', () => {
      cy.get('[data-cy=nav-products]').click();
      
      // Add product with specific quantity
      cy.get('[data-cy=product-card]').first().within(() => {
        cy.get('[data-cy=quantity-input]').clear().type('3');
        cy.get('[data-cy=add-to-cart]').click();
      });

      // Verify cart quantity
      cy.get('[data-cy=cart-count]').should('contain', '3');
    });

    it('should prevent adding more than available stock', () => {
      cy.get('[data-cy=nav-products]').click();
      
      cy.get('[data-cy=product-card]').first().within(() => {
        cy.get('[data-cy=quantity-input]').clear().type('999');
        cy.get('[data-cy=add-to-cart]').click();
      });

      cy.get('[data-cy=stock-error]')
        .should('be.visible')
        .and('contain', 'Insufficient stock');
    });
  });

  describe('Cart Management', () => {
    beforeEach(() => {
      // Add items to cart before each test
      cy.get('[data-cy=nav-products]').click();
      cy.get('[data-cy=product-card]').first().find('[data-cy=add-to-cart]').click();
      cy.get('[data-cy=product-card]').eq(1).find('[data-cy=add-to-cart]').click();
    });

    it('should update item quantity', () => {
      cy.get('[data-cy=cart-button]').click();
      
      // Update quantity
      cy.get('[data-cy=cart-item]').first().within(() => {
        cy.get('[data-cy=quantity-input]').clear().type('2');
        cy.get('[data-cy=update-quantity]').click();
      });

      // Verify total updated
      cy.get('[data-cy=cart-total]').should('not.equal', '0');
    });

    it('should remove items from cart', () => {
      cy.get('[data-cy=cart-button]').click();
      
      // Remove first item
      cy.get('[data-cy=cart-item]').first()
        .find('[data-cy=remove-item]')
        .click();

      // Verify item removed
      cy.get('[data-cy=cart-count]').should('contain', '1');
    });

    it('should clear entire cart', () => {
      cy.get('[data-cy=cart-button]').click();
      cy.get('[data-cy=clear-cart]').click();
      
      // Confirm clear cart
      cy.get('[data-cy=confirm-clear]').click();

      // Verify cart empty
      cy.get('[data-cy=empty-cart]').should('be.visible');
      cy.get('[data-cy=cart-count]').should('not.exist');
    });

    it('should persist cart data after page reload', () => {
      // Get initial cart count
      cy.get('[data-cy=cart-count]').invoke('text').as('initialCount');

      // Reload page
      cy.reload();

      // Verify cart count persisted
      cy.get('@initialCount').then(count => {
        cy.get('[data-cy=cart-count]').should('contain', count);
      });
    });
  });

  describe('Cart Calculations', () => {
    it('should calculate subtotal correctly', () => {
      // Add multiple items
      cy.get('[data-cy=nav-products]').click();
      
      cy.get('[data-cy=product-card]').first().within(() => {
        cy.get('[data-cy=product-price]').invoke('text').as('price1');
        cy.get('[data-cy=add-to-cart]').click();
      });

      cy.get('[data-cy=product-card]').eq(1).within(() => {
        cy.get('[data-cy=product-price]').invoke('text').as('price2');
        cy.get('[data-cy=add-to-cart]').click();
      });

      // Open cart and verify subtotal
      cy.get('[data-cy=cart-button]').click();
      
      cy.get('@price1').then(price1 => {
        cy.get('@price2').then(price2 => {
          const subtotal = (parseFloat(price1) + parseFloat(price2)).toFixed(2);
          cy.get('[data-cy=cart-subtotal]').should('contain', subtotal);
        });
      });
    });

    it('should apply tax correctly', () => {
      cy.get('[data-cy=nav-products]').click();
      cy.get('[data-cy=product-card]').first().find('[data-cy=add-to-cart]').click();
      cy.get('[data-cy=cart-button]').click();

      // Verify tax calculation (assuming 8% tax)
      cy.get('[data-cy=cart-subtotal]').invoke('text').then(subtotal => {
        const tax = (parseFloat(subtotal) * 0.08).toFixed(2);
        cy.get('[data-cy=cart-tax]').should('contain', tax);
      });
    });

    it('should calculate shipping based on location', () => {
      cy.get('[data-cy=nav-products]').click();
      cy.get('[data-cy=product-card]').first().find('[data-cy=add-to-cart]').click();
      cy.get('[data-cy=cart-button]').click();

      // Enter shipping info
      cy.get('[data-cy=shipping-zipcode]').type('12345');
      cy.get('[data-cy=calculate-shipping]').click();

      // Verify shipping cost displayed
      cy.get('[data-cy=shipping-cost]').should('be.visible');
    });
  });

  describe('Checkout Process', () => {
    beforeEach(() => {
      // Add item to cart and login
      cy.get('[data-cy=nav-products]').click();
      cy.get('[data-cy=product-card]').first().find('[data-cy=add-to-cart]').click();
      cy.login(testUser.email, testUser.password);
    });

    it('should proceed to checkout', () => {
      cy.get('[data-cy=cart-button]').click();
      cy.get('[data-cy=checkout-button]').click();

      // Verify on checkout page
      cy.url().should('include', '/checkout');
    });

    it('should require login for checkout', () => {
      cy.clearLocalStorage(); // Clear login state
      cy.reload();
      
      cy.get('[data-cy=cart-button]').click();
      cy.get('[data-cy=checkout-button]').click();

      // Should redirect to login
      cy.url().should('include', '/login');
    });

    it('should validate minimum order amount', () => {
      cy.get('[data-cy=nav-products]').click();
      
      // Add low-price item
      cy.get('[data-cy=product-card]')
        .contains('[data-cy=product-price]', '$5.00')
        .parent()
        .find('[data-cy=add-to-cart]')
        .click();

      cy.get('[data-cy=cart-button]').click();
      cy.get('[data-cy=checkout-button]').click();

      // Verify minimum order error
      cy.get('[data-cy=minimum-order-error]').should('be.visible');
    });
  });
});