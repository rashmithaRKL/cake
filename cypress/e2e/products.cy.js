describe('Product Catalog and Search', () => {
  beforeEach(() => {
    cy.visit('/products');
  });

  describe('Product Listing', () => {
    it('should display product grid', () => {
      cy.get('[data-cy=product-grid]').should('be.visible');
      cy.get('[data-cy=product-card]').should('have.length.at.least', 1);
    });

    it('should show product details on cards', () => {
      cy.get('[data-cy=product-card]').first().within(() => {
        cy.get('[data-cy=product-image]').should('be.visible');
        cy.get('[data-cy=product-name]').should('be.visible');
        cy.get('[data-cy=product-price]').should('be.visible');
        cy.get('[data-cy=product-category]').should('be.visible');
      });
    });

    it('should handle pagination', () => {
      // Check initial page
      cy.get('[data-cy=product-card]').should('have.length', 12); // Assuming 12 per page
      
      // Go to next page
      cy.get('[data-cy=next-page]').click();
      cy.url().should('include', 'page=2');
      
      // Go to specific page
      cy.get('[data-cy=page-3]').click();
      cy.url().should('include', 'page=3');
      
      // Go to previous page
      cy.get('[data-cy=prev-page]').click();
      cy.url().should('include', 'page=2');
    });

    it('should maintain scroll position after navigation', () => {
      // Scroll down
      cy.get('[data-cy=product-grid]').scrollTo('bottom');
      
      // Click product and go back
      cy.get('[data-cy=product-card]').last().click();
      cy.go('back');
      
      // Verify scroll position maintained
      cy.window().its('scrollY').should('be.gt', 0);
    });
  });

  describe('Filtering and Sorting', () => {
    it('should filter by category', () => {
      // Select category
      cy.get('[data-cy=category-filter]').click();
      cy.get('[data-cy=category-birthday]').click();
      
      // Verify URL and filtered results
      cy.url().should('include', 'category=birthday');
      cy.get('[data-cy=product-category]').each($el => {
        expect($el.text()).to.include('Birthday');
      });
    });

    it('should filter by price range', () => {
      // Set price range
      cy.get('[data-cy=min-price]').type('20');
      cy.get('[data-cy=max-price]').type('50');
      cy.get('[data-cy=apply-price-filter]').click();
      
      // Verify filtered results
      cy.get('[data-cy=product-price]').each($el => {
        const price = parseFloat($el.text().replace('$', ''));
        expect(price).to.be.within(20, 50);
      });
    });

    it('should sort products', () => {
      // Test price sorting
      cy.get('[data-cy=sort-select]').select('price-asc');
      cy.get('[data-cy=product-price]').then($prices => {
        const prices = [...$prices].map(el => 
          parseFloat(el.textContent.replace('$', '')));
        expect(prices).to.equal(prices.sort((a, b) => a - b));
      });

      // Test name sorting
      cy.get('[data-cy=sort-select]').select('name-asc');
      cy.get('[data-cy=product-name]').then($names => {
        const names = [...$names].map(el => el.textContent);
        expect(names).to.equal(names.sort());
      });
    });

    it('should combine multiple filters', () => {
      // Apply category filter
      cy.get('[data-cy=category-filter]').click();
      cy.get('[data-cy=category-birthday]').click();
      
      // Apply price filter
      cy.get('[data-cy=min-price]').type('20');
      cy.get('[data-cy=max-price]').type('50');
      cy.get('[data-cy=apply-price-filter]').click();
      
      // Apply sorting
      cy.get('[data-cy=sort-select]').select('price-desc');
      
      // Verify filtered and sorted results
      cy.url().should('include', 'category=birthday')
        .and('include', 'minPrice=20')
        .and('include', 'maxPrice=50')
        .and('include', 'sort=price-desc');
    });
  });

  describe('Search Functionality', () => {
    it('should search products by name', () => {
      cy.get('[data-cy=search-input]').type('chocolate cake{enter}');
      
      cy.get('[data-cy=product-card]').should('have.length.at.least', 1);
      cy.get('[data-cy=product-name]').first()
        .should('contain', 'Chocolate', { matchCase: false });
    });

    it('should handle search suggestions', () => {
      cy.get('[data-cy=search-input]').type('choc');
      
      cy.get('[data-cy=search-suggestions]')
        .should('be.visible')
        .find('li')
        .should('have.length.at.least', 1);
    });

    it('should show no results message', () => {
      cy.get('[data-cy=search-input]').type('nonexistent product{enter}');
      cy.get('[data-cy=no-results]').should('be.visible');
    });

    it('should preserve search query in URL', () => {
      cy.get('[data-cy=search-input]').type('chocolate cake{enter}');
      cy.url().should('include', 'search=chocolate+cake');
      
      // Reload page and verify search persists
      cy.reload();
      cy.get('[data-cy=search-input]').should('have.value', 'chocolate cake');
    });
  });

  describe('Product Details', () => {
    it('should navigate to product details', () => {
      cy.get('[data-cy=product-card]').first().click();
      cy.url().should('include', '/products/');
    });

    it('should show related products', () => {
      cy.get('[data-cy=product-card]').first().click();
      cy.get('[data-cy=related-products]')
        .should('be.visible')
        .find('[data-cy=product-card]')
        .should('have.length.at.least', 1);
    });

    it('should handle product variants', () => {
      cy.get('[data-cy=product-card]').first().click();
      
      // If variants exist
      cy.get('body').then($body => {
        if ($body.find('[data-cy=variant-select]').length) {
          cy.get('[data-cy=variant-select]').select('1');
          cy.get('[data-cy=product-price]').should('not.be.empty');
        }
      });
    });
  });

  describe('Responsive Behavior', () => {
    it('should adapt to mobile view', () => {
      cy.viewport('iphone-x');
      
      // Verify grid changes
      cy.get('[data-cy=product-grid]')
        .should('have.css', 'grid-template-columns')
        .and('match', /repeat\(1,/);
      
      // Verify filter sidebar becomes modal
      cy.get('[data-cy=filter-button]').should('be.visible').click();
      cy.get('[data-cy=filter-modal]').should('be.visible');
    });

    it('should handle touch interactions', () => {
      cy.viewport('iphone-x');
      
      // Test horizontal scroll on category chips
      cy.get('[data-cy=category-chips]')
        .scrollTo('right')
        .scrollTo('left');
      
      // Test touch-friendly filters
      cy.get('[data-cy=filter-button]').click();
      cy.get('[data-cy=price-slider]')
        .trigger('touchstart')
        .trigger('touchmove')
        .trigger('touchend');
    });
  });

  describe('Performance and Loading', () => {
    it('should show loading state', () => {
      cy.intercept('GET', '/api/products*', (req) => {
        req.delay(1000);
      }).as('getProducts');
      
      cy.visit('/products');
      cy.get('[data-cy=loading-skeleton]').should('be.visible');
      cy.wait('@getProducts');
      cy.get('[data-cy=loading-skeleton]').should('not.exist');
    });

    it('should lazy load images', () => {
      cy.get('[data-cy=product-image]').should('have.attr', 'loading', 'lazy');
    });

    it('should handle infinite scroll', () => {
      // Assuming infinite scroll is implemented
      cy.get('[data-cy=product-card]').should('have.length', 12);
      cy.scrollTo('bottom');
      cy.get('[data-cy=product-card]').should('have.length', 24);
    });
  });
});