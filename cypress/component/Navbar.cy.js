import React from 'react';
import Navbar from '../../client/src/components/Navbar';

describe('Navbar Component', () => {
  beforeEach(() => {
    // Mount the Navbar component before each test
    cy.mount(<Navbar />);
  });

  it('renders correctly', () => {
    // Check if main navigation elements are present
    cy.get('[data-cy=navbar]').should('exist');
    cy.get('[data-cy=nav-logo]').should('be.visible');
    cy.get('[data-cy=nav-links]').should('be.visible');
  });

  it('displays all navigation links', () => {
    // Check if all main navigation links are present
    const links = ['Home', 'Products', 'About', 'Contact'];
    
    links.forEach(link => {
      cy.get(`[data-cy=nav-${link.toLowerCase()}]`)
        .should('be.visible')
        .and('contain', link);
    });
  });

  it('shows user menu when logged in', () => {
    // Mock logged in state
    cy.window().then(win => {
      win.localStorage.setItem('token', 'fake-token');
      win.localStorage.setItem('user', JSON.stringify({
        name: 'Test User',
        role: 'user'
      }));
    });

    // Remount component with logged in state
    cy.mount(<Navbar />);

    // Check user menu
    cy.get('[data-cy=user-menu]').should('be.visible');
    cy.get('[data-cy=user-menu-button]').click();
    cy.get('[data-cy=user-menu-dropdown]').should('be.visible');
  });

  it('shows admin links for admin users', () => {
    // Mock admin user
    cy.window().then(win => {
      win.localStorage.setItem('token', 'fake-token');
      win.localStorage.setItem('user', JSON.stringify({
        name: 'Admin User',
        role: 'admin'
      }));
    });

    // Remount component with admin state
    cy.mount(<Navbar />);

    // Check admin links
    cy.get('[data-cy=admin-dashboard]').should('be.visible');
    cy.get('[data-cy=admin-products]').should('be.visible');
    cy.get('[data-cy=admin-orders]').should('be.visible');
  });

  it('handles mobile responsive design', () => {
    // Test mobile view
    cy.viewport('iphone-x');
    
    // Check if hamburger menu appears
    cy.get('[data-cy=mobile-menu-button]').should('be.visible');
    cy.get('[data-cy=nav-links]').should('not.be.visible');
    
    // Test menu interaction
    cy.get('[data-cy=mobile-menu-button]').click();
    cy.get('[data-cy=nav-links]').should('be.visible');
    
    // Test menu close
    cy.get('[data-cy=mobile-menu-close]').click();
    cy.get('[data-cy=nav-links]').should('not.be.visible');
  });

  it('handles cart interaction', () => {
    // Mock cart state
    cy.window().then(win => {
      win.localStorage.setItem('cart', JSON.stringify([
        { id: 1, quantity: 2 },
        { id: 2, quantity: 1 }
      ]));
    });

    // Remount component with cart state
    cy.mount(<Navbar />);

    // Check cart badge
    cy.get('[data-cy=cart-badge]')
      .should('be.visible')
      .and('contain', '3');

    // Test cart dropdown
    cy.get('[data-cy=cart-button]').click();
    cy.get('[data-cy=cart-dropdown]').should('be.visible');
  });

  it('handles search functionality', () => {
    // Open search
    cy.get('[data-cy=search-button]').click();
    cy.get('[data-cy=search-modal]').should('be.visible');
    
    // Test search input
    cy.get('[data-cy=search-input]')
      .should('be.visible')
      .type('chocolate cake');
    
    // Test search close
    cy.get('[data-cy=search-close]').click();
    cy.get('[data-cy=search-modal]').should('not.exist');
  });

  it('handles scroll behavior', () => {
    // Test navbar transparency
    cy.window().then(win => {
      // Scroll down
      win.scrollY = 100;
      win.dispatchEvent(new Event('scroll'));
      
      cy.get('[data-cy=navbar]')
        .should('have.class', 'bg-white')
        .and('have.class', 'shadow-md');
      
      // Scroll to top
      win.scrollY = 0;
      win.dispatchEvent(new Event('scroll'));
      
      cy.get('[data-cy=navbar]')
        .should('not.have.class', 'bg-white')
        .and('not.have.class', 'shadow-md');
    });
  });

  it('handles active link states', () => {
    // Mock current route
    cy.window().then(win => {
      win.history.pushState({}, '', '/products');
    });

    // Remount component
    cy.mount(<Navbar />);

    // Check active link
    cy.get('[data-cy=nav-products]')
      .should('have.class', 'active');
  });

  it('handles logout', () => {
    // Mock logged in state
    cy.window().then(win => {
      win.localStorage.setItem('token', 'fake-token');
      win.localStorage.setItem('user', JSON.stringify({
        name: 'Test User',
        role: 'user'
      }));
    });

    // Remount component
    cy.mount(<Navbar />);

    // Test logout
    cy.get('[data-cy=user-menu-button]').click();
    cy.get('[data-cy=logout-button]').click();

    // Verify localStorage cleared
    cy.window().then(win => {
      expect(win.localStorage.getItem('token')).to.be.null;
      expect(win.localStorage.getItem('user')).to.be.null;
    });
  });

  it('handles animations correctly', () => {
    // Test dropdown animation
    cy.get('[data-cy=user-menu-button]').click();
    cy.get('[data-cy=user-menu-dropdown]')
      .should('have.class', 'animate-fadeIn');
    
    // Test mobile menu animation
    cy.viewport('iphone-x');
    cy.get('[data-cy=mobile-menu-button]').click();
    cy.get('[data-cy=nav-links]')
      .should('have.class', 'animate-slideIn');
  });
});