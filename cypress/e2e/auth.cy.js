describe('Authentication Flow', () => {
  const testUser = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'Test123!@#',
    phoneNumber: '+1234567890'
  };

  beforeEach(() => {
    // Clear localStorage before each test
    cy.clearLocalStorage();
    cy.visit('/');
  });

  describe('Registration', () => {
    it('should register a new user successfully', () => {
      // Navigate to register page
      cy.get('[data-cy=nav-register]').click();
      cy.url().should('include', '/register');

      // Fill registration form
      cy.get('[data-cy=register-name]').type(testUser.name);
      cy.get('[data-cy=register-email]').type(testUser.email);
      cy.get('[data-cy=register-password]').type(testUser.password);
      cy.get('[data-cy=register-confirm-password]').type(testUser.password);
      cy.get('[data-cy=register-phone]').type(testUser.phoneNumber);

      // Submit form
      cy.get('[data-cy=register-submit]').click();

      // Verify success
      cy.get('[data-cy=registration-success]')
        .should('be.visible')
        .and('contain', 'Registration successful');
      
      // Verify redirect to email verification page
      cy.url().should('include', '/verify-email');
    });

    it('should show validation errors', () => {
      cy.get('[data-cy=nav-register]').click();

      // Test empty form submission
      cy.get('[data-cy=register-submit]').click();
      cy.get('[data-cy=form-error]').should('be.visible');

      // Test invalid email
      cy.get('[data-cy=register-email]').type('invalid-email');
      cy.get('[data-cy=email-error]')
        .should('be.visible')
        .and('contain', 'Invalid email address');

      // Test password mismatch
      cy.get('[data-cy=register-password]').type('password1');
      cy.get('[data-cy=register-confirm-password]').type('password2');
      cy.get('[data-cy=password-match-error]')
        .should('be.visible')
        .and('contain', 'Passwords do not match');
    });

    it('should prevent duplicate email registration', () => {
      // Try to register with existing email
      cy.get('[data-cy=nav-register]').click();
      cy.get('[data-cy=register-name]').type('Another User');
      cy.get('[data-cy=register-email]').type(testUser.email);
      cy.get('[data-cy=register-password]').type('Password123!');
      cy.get('[data-cy=register-confirm-password]').type('Password123!');
      cy.get('[data-cy=register-phone]').type('+1987654321');
      cy.get('[data-cy=register-submit]').click();

      cy.get('[data-cy=email-exists-error]')
        .should('be.visible')
        .and('contain', 'Email already exists');
    });
  });

  describe('Login', () => {
    it('should login successfully', () => {
      // Navigate to login page
      cy.get('[data-cy=nav-login]').click();
      cy.url().should('include', '/login');

      // Fill login form
      cy.get('[data-cy=login-email]').type(testUser.email);
      cy.get('[data-cy=login-password]').type(testUser.password);

      // Submit form
      cy.get('[data-cy=login-submit]').click();

      // Verify successful login
      cy.get('[data-cy=user-menu]').should('be.visible');
      cy.get('[data-cy=user-name]').should('contain', testUser.name);

      // Verify localStorage
      cy.window().its('localStorage').invoke('getItem', 'token')
        .should('exist');
    });

    it('should show error for invalid credentials', () => {
      cy.get('[data-cy=nav-login]').click();

      // Test with wrong password
      cy.get('[data-cy=login-email]').type(testUser.email);
      cy.get('[data-cy=login-password]').type('wrongpassword');
      cy.get('[data-cy=login-submit]').click();

      cy.get('[data-cy=login-error]')
        .should('be.visible')
        .and('contain', 'Invalid credentials');
    });

    it('should handle "Remember Me" functionality', () => {
      cy.get('[data-cy=nav-login]').click();

      // Login with "Remember Me"
      cy.get('[data-cy=login-email]').type(testUser.email);
      cy.get('[data-cy=login-password]').type(testUser.password);
      cy.get('[data-cy=remember-me]').check();
      cy.get('[data-cy=login-submit]').click();

      // Verify persistent login
      cy.reload();
      cy.get('[data-cy=user-menu]').should('be.visible');
    });
  });

  describe('Password Reset', () => {
    it('should handle forgot password flow', () => {
      cy.get('[data-cy=nav-login]').click();
      cy.get('[data-cy=forgot-password]').click();

      // Submit email for password reset
      cy.get('[data-cy=reset-email]').type(testUser.email);
      cy.get('[data-cy=reset-submit]').click();

      // Verify success message
      cy.get('[data-cy=reset-success]')
        .should('be.visible')
        .and('contain', 'Password reset email sent');
    });

    it('should validate reset password form', () => {
      cy.visit('/reset-password/invalid-token');

      // Try submitting empty form
      cy.get('[data-cy=new-password-submit]').click();
      cy.get('[data-cy=password-error]').should('be.visible');

      // Try weak password
      cy.get('[data-cy=new-password]').type('weak');
      cy.get('[data-cy=password-strength-error]')
        .should('be.visible')
        .and('contain', 'Password must be at least 8 characters');
    });
  });

  describe('Logout', () => {
    beforeEach(() => {
      // Login before testing logout
      cy.login(testUser.email, testUser.password);
    });

    it('should logout successfully', () => {
      // Trigger logout
      cy.get('[data-cy=user-menu]').click();
      cy.get('[data-cy=logout-button]').click();

      // Verify logout
      cy.get('[data-cy=nav-login]').should('be.visible');
      
      // Verify localStorage cleared
      cy.window().its('localStorage').invoke('getItem', 'token')
        .should('not.exist');
    });

    it('should redirect to login after logout', () => {
      cy.get('[data-cy=user-menu]').click();
      cy.get('[data-cy=logout-button]').click();
      cy.url().should('include', '/login');
    });
  });

  describe('Protected Routes', () => {
    it('should redirect to login for protected routes when not authenticated', () => {
      // Try accessing protected route
      cy.visit('/profile');
      cy.url().should('include', '/login');
      
      // Verify redirect message
      cy.get('[data-cy=login-message]')
        .should('be.visible')
        .and('contain', 'Please login to access this page');
    });

    it('should maintain original destination after login redirect', () => {
      // Try accessing protected route
      cy.visit('/profile');
      
      // Login
      cy.get('[data-cy=login-email]').type(testUser.email);
      cy.get('[data-cy=login-password]').type(testUser.password);
      cy.get('[data-cy=login-submit]').click();

      // Verify redirect to original destination
      cy.url().should('include', '/profile');
    });
  });
});