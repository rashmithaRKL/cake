describe('Home Page', () => {
  beforeEach(() => {
    // Visit the home page before each test
    cy.visit('/');
    
    // Wait for initial animations to complete
    cy.wait(1000);
  });

  it('displays the hero section correctly', () => {
    // Check hero section content
    cy.get('[data-cy=hero-title]')
      .should('be.visible')
      .and('contain', 'Sweet Moments');
    
    cy.get('[data-cy=hero-subtitle]')
      .should('be.visible')
      .and('contain', 'Perfect Celebrations');
    
    cy.get('[data-cy=hero-cta]')
      .should('be.visible')
      .and('contain', 'Explore Our Collection');
  });

  it('navigates to products page from hero CTA', () => {
    cy.get('[data-cy=hero-cta]').click();
    cy.url().should('include', '/products');
  });

  it('displays featured products section', () => {
    cy.get('[data-cy=featured-products]').should('be.visible');
    cy.get('[data-cy=product-card]').should('have.length.at.least', 3);
    
    // Check first product card
    cy.get('[data-cy=product-card]').first().within(() => {
      cy.get('[data-cy=product-image]').should('be.visible');
      cy.get('[data-cy=product-name]').should('be.visible');
      cy.get('[data-cy=product-price]').should('be.visible');
      cy.get('[data-cy=view-details-button]').should('be.visible');
    });
  });

  it('allows navigation to product details', () => {
    cy.get('[data-cy=product-card]').first()
      .find('[data-cy=view-details-button]')
      .click();
    
    cy.url().should('include', '/products/');
  });

  it('displays "Why Choose Us" section', () => {
    cy.get('[data-cy=why-choose-us]').scrollIntoView();
    
    // Check for animation
    cy.get('[data-cy=feature-card]')
      .should('have.length', 3)
      .and('be.visible');
    
    // Verify content
    cy.get('[data-cy=feature-card]').first().within(() => {
      cy.get('[data-cy=feature-icon]').should('be.visible');
      cy.get('[data-cy=feature-title]').should('be.visible');
      cy.get('[data-cy=feature-description]').should('be.visible');
    });
  });

  it('displays call-to-action section', () => {
    cy.get('[data-cy=cta-section]').scrollIntoView();
    cy.get('[data-cy=cta-title]').should('be.visible');
    cy.get('[data-cy=cta-button]')
      .should('be.visible')
      .and('contain', 'Contact Us Now');
  });

  it('navigates to contact page from CTA button', () => {
    cy.get('[data-cy=cta-section]').scrollIntoView();
    cy.get('[data-cy=cta-button]').click();
    cy.url().should('include', '/contact');
  });

  it('has working navigation links', () => {
    // Test navbar links
    cy.get('[data-cy=nav-about]').click();
    cy.url().should('include', '/about');
    cy.go('back');

    cy.get('[data-cy=nav-products]').click();
    cy.url().should('include', '/products');
    cy.go('back');

    cy.get('[data-cy=nav-contact]').click();
    cy.url().should('include', '/contact');
    cy.go('back');
  });

  it('is responsive on different screen sizes', () => {
    // Test mobile view
    cy.viewport('iphone-x');
    cy.get('[data-cy=mobile-menu-button]').should('be.visible');
    cy.get('[data-cy=nav-links]').should('not.be.visible');
    
    // Open mobile menu
    cy.get('[data-cy=mobile-menu-button]').click();
    cy.get('[data-cy=nav-links]').should('be.visible');
    
    // Test tablet view
    cy.viewport('ipad-2');
    cy.get('[data-cy=nav-links]').should('be.visible');
    cy.get('[data-cy=mobile-menu-button]').should('not.be.visible');
    
    // Test desktop view
    cy.viewport(1280, 720);
    cy.get('[data-cy=nav-links]').should('be.visible');
    cy.get('[data-cy=mobile-menu-button]').should('not.be.visible');
  });

  it('loads images correctly', () => {
    cy.get('img').each($img => {
      // Check if image is loaded
      expect($img[0].naturalWidth).to.be.greaterThan(0);
    });
  });

  it('has correct meta tags', () => {
    cy.document().then(doc => {
      // Check title
      expect(doc.title).to.contain('Sweet Delights');
      
      // Check meta description
      const metaDescription = doc.querySelector('meta[name="description"]');
      expect(metaDescription.content).to.not.be.empty;
    });
  });

  it('performs smooth scrolling', () => {
    cy.get('[data-cy=scroll-to-products]').click();
    cy.window().its('scrollY').should('be.greaterThan', 0);
  });

  it('handles errors gracefully', () => {
    // Intercept API calls and simulate error
    cy.intercept('GET', '/api/products/featured', {
      statusCode: 500,
      body: { error: 'Server error' }
    });
    
    cy.reload();
    
    // Check if error message is displayed
    cy.get('[data-cy=error-message]')
      .should('be.visible')
      .and('contain', 'Error loading products');
  });
});