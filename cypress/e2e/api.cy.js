describe('API Endpoints', () => {
  let authToken;
  let userId;

  before(() => {
    // Register and login a test user before running tests
    cy.request({
      method: 'POST',
      url: '/api/auth/register',
      body: {
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'Test123!@#',
        phoneNumber: '+1234567890'
      }
    }).then((response) => {
      expect(response.status).to.eq(201);
      
      // Login with the created user
      cy.request({
        method: 'POST',
        url: '/api/auth/login',
        body: {
          email: response.body.email,
          password: 'Test123!@#'
        }
      }).then((loginResponse) => {
        authToken = loginResponse.body.token;
        userId = loginResponse.body.user.id;
      });
    });
  });

  describe('Authentication Endpoints', () => {
    it('should login with valid credentials', () => {
      cy.request({
        method: 'POST',
        url: '/api/auth/login',
        body: {
          email: 'test@example.com',
          password: 'Test123!@#'
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('token');
        expect(response.body.user).to.have.property('id');
      });
    });

    it('should not login with invalid credentials', () => {
      cy.request({
        method: 'POST',
        url: '/api/auth/login',
        body: {
          email: 'test@example.com',
          password: 'wrongpassword'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body).to.have.property('error', 'Invalid credentials');
      });
    });

    it('should handle password reset request', () => {
      cy.request({
        method: 'POST',
        url: '/api/auth/forgot-password',
        body: {
          email: 'test@example.com'
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('message', 'Password reset email sent');
      });
    });
  });

  describe('Product Endpoints', () => {
    let productId;

    it('should get all products', () => {
      cy.request('/api/products').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data).to.be.an('array');
      });
    });

    it('should create a new product with admin token', () => {
      // Login as admin first
      cy.request({
        method: 'POST',
        url: '/api/auth/login',
        body: {
          email: Cypress.env('adminEmail'),
          password: Cypress.env('adminPassword')
        }
      }).then((loginResponse) => {
        const adminToken = loginResponse.body.token;

        cy.request({
          method: 'POST',
          url: '/api/products',
          headers: {
            Authorization: `Bearer ${adminToken}`
          },
          body: {
            name: 'Test Cake',
            description: 'A delicious test cake',
            price: 29.99,
            category: 'birthday',
            stock: 10
          }
        }).then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body.data).to.have.property('name', 'Test Cake');
          productId = response.body.data._id;
        });
      });
    });

    it('should get a single product', () => {
      cy.request(`/api/products/${productId}`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data).to.have.property('_id', productId);
      });
    });

    it('should update a product with admin token', () => {
      cy.request({
        method: 'PUT',
        url: `/api/products/${productId}`,
        headers: {
          Authorization: `Bearer ${Cypress.env('adminToken')}`
        },
        body: {
          price: 34.99
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data.price).to.eq(34.99);
      });
    });
  });

  describe('Order Endpoints', () => {
    let orderId;

    it('should create a new order', () => {
      cy.request({
        method: 'POST',
        url: '/api/orders',
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        body: {
          items: [{
            product: productId,
            quantity: 2
          }],
          shippingAddress: {
            street: '123 Test St',
            city: 'Test City',
            state: 'TS',
            zipCode: '12345',
            country: 'USA'
          },
          paymentMethod: 'stripe'
        }
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.data).to.have.property('orderNumber');
        orderId = response.body.data._id;
      });
    });

    it('should get user orders', () => {
      cy.request({
        method: 'GET',
        url: '/api/orders/my-orders',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data).to.be.an('array');
      });
    });

    it('should get a single order', () => {
      cy.request({
        method: 'GET',
        url: `/api/orders/${orderId}`,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data).to.have.property('_id', orderId);
      });
    });
  });

  describe('User Profile Endpoints', () => {
    it('should get user profile', () => {
      cy.request({
        method: 'GET',
        url: '/api/auth/me',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data).to.have.property('_id', userId);
      });
    });

    it('should update user profile', () => {
      cy.request({
        method: 'PUT',
        url: '/api/users/profile',
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        body: {
          name: 'Updated Name',
          phoneNumber: '+1987654321'
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data.name).to.eq('Updated Name');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid routes', () => {
      cy.request({
        url: '/api/invalid-route',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });

    it('should handle unauthorized access', () => {
      cy.request({
        method: 'GET',
        url: '/api/admin/dashboard',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
    });

    it('should handle validation errors', () => {
      cy.request({
        method: 'POST',
        url: '/api/auth/register',
        body: {
          email: 'invalid-email',
          password: '123'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property('error');
      });
    });
  });
});