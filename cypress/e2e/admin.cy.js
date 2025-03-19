describe('Admin Dashboard', () => {
  const adminUser = {
    email: Cypress.env('adminEmail'),
    password: Cypress.env('adminPassword')
  };

  beforeEach(() => {
    // Login as admin before each test
    cy.loginAsAdmin();
    cy.visit('/admin');
  });

  describe('Dashboard Overview', () => {
    it('should display key metrics', () => {
      cy.get('[data-cy=dashboard-metrics]').within(() => {
        cy.get('[data-cy=total-sales]').should('be.visible');
        cy.get('[data-cy=total-orders]').should('be.visible');
        cy.get('[data-cy=total-customers]').should('be.visible');
        cy.get('[data-cy=average-order-value]').should('be.visible');
      });
    });

    it('should show sales chart', () => {
      cy.get('[data-cy=sales-chart]').should('be.visible');
      
      // Test chart interactions
      cy.get('[data-cy=chart-period-select]').select('monthly');
      cy.get('[data-cy=chart-data]').should('be.visible');
    });

    it('should display recent orders', () => {
      cy.get('[data-cy=recent-orders]').within(() => {
        cy.get('[data-cy=order-item]').should('have.length.at.least', 1);
        cy.get('[data-cy=order-date]').should('be.visible');
        cy.get('[data-cy=order-status]').should('be.visible');
      });
    });
  });

  describe('Product Management', () => {
    beforeEach(() => {
      cy.get('[data-cy=nav-products]').click();
    });

    it('should list all products', () => {
      cy.get('[data-cy=products-table]').should('be.visible');
      cy.get('[data-cy=product-row]').should('have.length.at.least', 1);
    });

    it('should add new product', () => {
      cy.get('[data-cy=add-product]').click();

      // Fill product form
      cy.get('[data-cy=product-name]').type('Test Cake');
      cy.get('[data-cy=product-description]').type('A delicious test cake');
      cy.get('[data-cy=product-price]').type('29.99');
      cy.get('[data-cy=product-category]').select('birthday');
      cy.get('[data-cy=product-stock]').type('50');

      // Upload image
      cy.get('[data-cy=product-image]').attachFile('test-cake.jpg');

      // Submit form
      cy.get('[data-cy=submit-product]').click();

      // Verify success
      cy.get('[data-cy=success-message]').should('be.visible');
    });

    it('should edit product', () => {
      cy.get('[data-cy=product-row]').first().find('[data-cy=edit-product]').click();
      
      cy.get('[data-cy=product-price]').clear().type('39.99');
      cy.get('[data-cy=product-stock]').clear().type('75');
      
      cy.get('[data-cy=save-changes]').click();
      cy.get('[data-cy=success-message]').should('be.visible');
    });

    it('should delete product', () => {
      cy.get('[data-cy=product-row]').first().find('[data-cy=delete-product]').click();
      cy.get('[data-cy=confirm-delete]').click();
      cy.get('[data-cy=success-message]').should('be.visible');
    });

    it('should handle bulk actions', () => {
      // Select multiple products
      cy.get('[data-cy=product-checkbox]').first().check();
      cy.get('[data-cy=product-checkbox]').eq(1).check();
      
      // Perform bulk action
      cy.get('[data-cy=bulk-action]').select('delete');
      cy.get('[data-cy=apply-bulk-action]').click();
      
      cy.get('[data-cy=confirm-bulk-action]').click();
      cy.get('[data-cy=success-message]').should('be.visible');
    });
  });

  describe('Order Management', () => {
    beforeEach(() => {
      cy.get('[data-cy=nav-orders]').click();
    });

    it('should list all orders', () => {
      cy.get('[data-cy=orders-table]').should('be.visible');
      cy.get('[data-cy=order-row]').should('have.length.at.least', 1);
    });

    it('should filter orders', () => {
      cy.get('[data-cy=filter-status]').select('pending');
      cy.get('[data-cy=filter-date]').type('2023-01-01');
      cy.get('[data-cy=apply-filters]').click();
      
      cy.get('[data-cy=order-row]').should('have.length.at.least', 0);
    });

    it('should update order status', () => {
      cy.get('[data-cy=order-row]').first().find('[data-cy=status-select]').select('processing');
      cy.get('[data-cy=save-status]').click();
      cy.get('[data-cy=success-message]').should('be.visible');
    });

    it('should view order details', () => {
      cy.get('[data-cy=order-row]').first().find('[data-cy=view-details]').click();
      
      cy.get('[data-cy=order-details]').within(() => {
        cy.get('[data-cy=customer-info]').should('be.visible');
        cy.get('[data-cy=order-items]').should('be.visible');
        cy.get('[data-cy=shipping-info]').should('be.visible');
        cy.get('[data-cy=payment-info]').should('be.visible');
      });
    });
  });

  describe('Customer Management', () => {
    beforeEach(() => {
      cy.get('[data-cy=nav-customers]').click();
    });

    it('should list all customers', () => {
      cy.get('[data-cy=customers-table]').should('be.visible');
      cy.get('[data-cy=customer-row]').should('have.length.at.least', 1);
    });

    it('should search customers', () => {
      cy.get('[data-cy=search-customers]').type('test@example.com');
      cy.get('[data-cy=customer-row]').should('have.length', 1);
    });

    it('should view customer details', () => {
      cy.get('[data-cy=customer-row]').first().find('[data-cy=view-customer]').click();
      
      cy.get('[data-cy=customer-details]').within(() => {
        cy.get('[data-cy=order-history]').should('be.visible');
        cy.get('[data-cy=customer-info]').should('be.visible');
      });
    });
  });

  describe('Settings', () => {
    beforeEach(() => {
      cy.get('[data-cy=nav-settings]').click();
    });

    it('should update store settings', () => {
      cy.get('[data-cy=store-name]').clear().type('Updated Store Name');
      cy.get('[data-cy=store-email]').clear().type('updated@store.com');
      
      cy.get('[data-cy=save-settings]').click();
      cy.get('[data-cy=success-message]').should('be.visible');
    });

    it('should manage shipping zones', () => {
      cy.get('[data-cy=shipping-tab]').click();
      cy.get('[data-cy=add-zone]').click();
      
      cy.get('[data-cy=zone-name]').type('New Zone');
      cy.get('[data-cy=zone-regions]').type('Region 1, Region 2');
      cy.get('[data-cy=zone-rate]').type('10');
      
      cy.get('[data-cy=save-zone]').click();
      cy.get('[data-cy=success-message]').should('be.visible');
    });

    it('should manage tax rates', () => {
      cy.get('[data-cy=tax-tab]').click();
      cy.get('[data-cy=add-tax-rate]').click();
      
      cy.get('[data-cy=tax-name]').type('New Tax');
      cy.get('[data-cy=tax-rate]').type('8');
      cy.get('[data-cy=tax-regions]').type('Region 1');
      
      cy.get('[data-cy=save-tax]').click();
      cy.get('[data-cy=success-message]').should('be.visible');
    });
  });

  describe('Security', () => {
    it('should prevent unauthorized access', () => {
      cy.clearLocalStorage(); // Clear admin session
      cy.visit('/admin');
      cy.url().should('include', '/login');
    });

    it('should log admin actions', () => {
      cy.get('[data-cy=nav-logs]').click();
      cy.get('[data-cy=admin-logs]').should('be.visible');
      cy.get('[data-cy=log-entry]').should('have.length.at.least', 1);
    });
  });
});