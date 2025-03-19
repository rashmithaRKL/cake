describe('User Profile and Account Management', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'Test123!@#',
    newPassword: 'NewTest123!@#'
  };

  beforeEach(() => {
    cy.login(testUser.email, testUser.password);
    cy.visit('/account');
  });

  describe('Profile Overview', () => {
    it('should display user information', () => {
      cy.get('[data-cy=profile-section]').within(() => {
        cy.get('[data-cy=user-name]').should('be.visible');
        cy.get('[data-cy=user-email]').should('be.visible');
        cy.get('[data-cy=user-joined-date]').should('be.visible');
        cy.get('[data-cy=profile-avatar]').should('be.visible');
      });
    });

    it('should show account statistics', () => {
      cy.get('[data-cy=account-stats]').within(() => {
        cy.get('[data-cy=total-orders]').should('be.visible');
        cy.get('[data-cy=total-spent]').should('be.visible');
        cy.get('[data-cy=reward-points]').should('be.visible');
      });
    });

    it('should display navigation tabs', () => {
      cy.get('[data-cy=profile-tabs]').within(() => {
        cy.get('[data-cy=orders-tab]').should('be.visible');
        cy.get('[data-cy=addresses-tab]').should('be.visible');
        cy.get('[data-cy=payment-tab]').should('be.visible');
        cy.get('[data-cy=settings-tab]').should('be.visible');
      });
    });
  });

  describe('Profile Edit', () => {
    beforeEach(() => {
      cy.get('[data-cy=edit-profile-button]').click();
    });

    it('should update personal information', () => {
      // Update name
      cy.get('[data-cy=edit-name]').clear().type('Updated Name');
      
      // Update phone
      cy.get('[data-cy=edit-phone]').clear().type('+1234567890');
      
      // Update birthday
      cy.get('[data-cy=edit-birthday]').type('1990-01-01');
      
      // Save changes
      cy.get('[data-cy=save-profile]').click();
      
      // Verify success message
      cy.get('[data-cy=success-message]')
        .should('be.visible')
        .and('contain', 'Profile updated successfully');
      
      // Verify updates reflected
      cy.get('[data-cy=user-name]').should('contain', 'Updated Name');
    });

    it('should update profile picture', () => {
      // Upload new profile picture
      cy.get('[data-cy=avatar-upload]').attachFile('profile-pic.jpg');
      
      // Verify preview
      cy.get('[data-cy=avatar-preview]').should('be.visible');
      
      // Save changes
      cy.get('[data-cy=save-profile]').click();
      
      // Verify new avatar
      cy.get('[data-cy=profile-avatar]')
        .should('have.attr', 'src')
        .and('include', 'profile-pic');
    });

    it('should validate form inputs', () => {
      // Test empty name
      cy.get('[data-cy=edit-name]').clear();
      cy.get('[data-cy=save-profile]').click();
      cy.get('[data-cy=name-error]').should('be.visible');
      
      // Test invalid phone
      cy.get('[data-cy=edit-phone]').clear().type('invalid');
      cy.get('[data-cy=phone-error]').should('be.visible');
      
      // Test future birthday
      cy.get('[data-cy=edit-birthday]').type('2025-01-01');
      cy.get('[data-cy=birthday-error]').should('be.visible');
    });
  });

  describe('Password Management', () => {
    beforeEach(() => {
      cy.get('[data-cy=settings-tab]').click();
      cy.get('[data-cy=change-password-button]').click();
    });

    it('should change password successfully', () => {
      // Enter passwords
      cy.get('[data-cy=current-password]').type(testUser.password);
      cy.get('[data-cy=new-password]').type(testUser.newPassword);
      cy.get('[data-cy=confirm-password]').type(testUser.newPassword);
      
      // Submit change
      cy.get('[data-cy=submit-password-change]').click();
      
      // Verify success
      cy.get('[data-cy=success-message]').should('be.visible');
      
      // Verify can login with new password
      cy.logout();
      cy.login(testUser.email, testUser.newPassword);
    });

    it('should validate password requirements', () => {
      cy.get('[data-cy=current-password]').type(testUser.password);
      cy.get('[data-cy=new-password]').type('weak');
      
      // Check password strength indicators
      cy.get('[data-cy=password-strength]').should('contain', 'Weak');
      cy.get('[data-cy=password-requirements]').should('be.visible');
    });

    it('should handle incorrect current password', () => {
      cy.get('[data-cy=current-password]').type('wrongpassword');
      cy.get('[data-cy=new-password]').type(testUser.newPassword);
      cy.get('[data-cy=confirm-password]').type(testUser.newPassword);
      cy.get('[data-cy=submit-password-change]').click();
      
      cy.get('[data-cy=error-message]')
        .should('be.visible')
        .and('contain', 'Current password is incorrect');
    });
  });

  describe('Address Management', () => {
    beforeEach(() => {
      cy.get('[data-cy=addresses-tab]').click();
    });

    it('should add new address', () => {
      cy.get('[data-cy=add-address]').click();
      
      // Fill address form
      cy.get('[data-cy=address-name]').type('Home');
      cy.get('[data-cy=street-address]').type('123 Test St');
      cy.get('[data-cy=city]').type('Test City');
      cy.get('[data-cy=state]').type('TS');
      cy.get('[data-cy=zip]').type('12345');
      cy.get('[data-cy=country]').select('United States');
      
      // Save address
      cy.get('[data-cy=save-address]').click();
      
      // Verify new address added
      cy.get('[data-cy=address-card]')
        .should('have.length.at.least', 1)
        .and('contain', '123 Test St');
    });

    it('should edit existing address', () => {
      cy.get('[data-cy=address-card]').first()
        .find('[data-cy=edit-address]')
        .click();
      
      cy.get('[data-cy=street-address]')
        .clear()
        .type('456 Updated St');
      
      cy.get('[data-cy=save-address]').click();
      
      cy.get('[data-cy=address-card]')
        .first()
        .should('contain', '456 Updated St');
    });

    it('should delete address', () => {
      cy.get('[data-cy=address-card]')
        .its('length')
        .then(initialCount => {
          cy.get('[data-cy=address-card]')
            .first()
            .find('[data-cy=delete-address]')
            .click();
          
          cy.get('[data-cy=confirm-delete]').click();
          
          cy.get('[data-cy=address-card]')
            .should('have.length', initialCount - 1);
        });
    });

    it('should set default address', () => {
      cy.get('[data-cy=address-card]')
        .first()
        .find('[data-cy=set-default]')
        .click();
      
      cy.get('[data-cy=address-card]')
        .first()
        .should('have.class', 'default-address');
    });
  });

  describe('Payment Methods', () => {
    beforeEach(() => {
      cy.get('[data-cy=payment-tab]').click();
    });

    it('should add new payment method', () => {
      cy.get('[data-cy=add-payment]').click();
      
      // Fill card details
      cy.get('[data-cy=card-number]').type('4242424242424242');
      cy.get('[data-cy=card-expiry]').type('1225');
      cy.get('[data-cy=card-cvc]').type('123');
      
      cy.get('[data-cy=save-card]').click();
      
      // Verify new card added
      cy.get('[data-cy=payment-method]')
        .should('have.length.at.least', 1)
        .and('contain', '****4242');
    });

    it('should delete payment method', () => {
      cy.get('[data-cy=payment-method]')
        .first()
        .find('[data-cy=delete-payment]')
        .click();
      
      cy.get('[data-cy=confirm-delete]').click();
      
      cy.get('[data-cy=success-message]').should('be.visible');
    });

    it('should set default payment method', () => {
      cy.get('[data-cy=payment-method]')
        .first()
        .find('[data-cy=set-default]')
        .click();
      
      cy.get('[data-cy=payment-method]')
        .first()
        .should('have.class', 'default-payment');
    });
  });

  describe('Notification Preferences', () => {
    beforeEach(() => {
      cy.get('[data-cy=settings-tab]').click();
      cy.get('[data-cy=notification-settings]').click();
    });

    it('should update email preferences', () => {
      cy.get('[data-cy=order-updates]').check();
      cy.get('[data-cy=promotions]').uncheck();
      cy.get('[data-cy=newsletter]').check();
      
      cy.get('[data-cy=save-preferences]').click();
      
      cy.get('[data-cy=success-message]').should('be.visible');
    });

    it('should update push notification settings', () => {
      cy.get('[data-cy=push-notifications]').check();
      cy.get('[data-cy=order-status-push]').check();
      
      cy.get('[data-cy=save-preferences]').click();
      
      cy.get('[data-cy=success-message]').should('be.visible');
    });
  });

  describe('Account Deletion', () => {
    it('should handle account deletion request', () => {
      cy.get('[data-cy=settings-tab]').click();
      cy.get('[data-cy=delete-account]').click();
      
      // Verify password required
      cy.get('[data-cy=confirm-password]').type('wrongpassword');
      cy.get('[data-cy=confirm-delete-account]').click();
      cy.get('[data-cy=error-message]').should('be.visible');
      
      // Correct password
      cy.get('[data-cy=confirm-password]').clear().type(testUser.password);
      cy.get('[data-cy=confirm-delete-account]').click();
      
      // Verify redirect to home
      cy.url().should('eq', Cypress.config().baseUrl + '/');
      
      // Verify cannot login
      cy.login(testUser.email, testUser.password);
      cy.get('[data-cy=error-message]')
        .should('contain', 'Account not found');
    });
  });
});