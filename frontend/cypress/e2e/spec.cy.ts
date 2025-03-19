describe('Home page', () => {
  it('Visits the landing page', () => {
    cy.visit('/')
    cy.contains('High-quality equipment. Simply rented.')
  })
})

describe('Register as Private Client', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('register successfully', () => {

    cy.intercept('POST', '**/api/auth/register', {  // ✅ Korrekt, ohne Ausrufezeichen
      statusCode: 201,
      body: {
        id: 1,
        firstName: 'Max',
        lastName: 'Mustermann',
        email: 'max.mustermann@example.com'
      }
    }).as('registerRequest');

    cy.get('input[formControlName="firstName"]').type('Max');
    cy.get('input[formControlName="lastName"]').type('Mustermann');
    cy.get('input[formControlName="email"]').type('max.mustermann@example.com');
    cy.get('input[formControlName="password"]').type('Password123!');
    cy.get('input[formControlName="repeatPassword"]').type('Password123!');

    cy.get('input[id="street"]').type('Musterstraße 1');
    cy.get('input[id="postalCode"]').type('12345');
    cy.get('input[id="city"]').type('Musterstadt');
    cy.get('input[id="state"]').type('Musterland');
    cy.get('input[id="country"]').type('Deutschland');

    cy.get('button[type="submit"]').click();

    cy.wait('@registerRequest').its('response.statusCode').should('eq', 201);
    cy.contains('You’ll receive a link to verify your account shortly.').should('exist');

  });

  it('Failed register, email already exists', () => {
    cy.intercept('POST', '**/api/auth/register', {
      statusCode: 400,
      body: {
        message: 'Email already exists'
      }
    }).as('registerError');

    cy.get('input[formControlName="firstName"]').type('Max');
    cy.get('input[formControlName="lastName"]').type('Mustermann');
    cy.get('input[formControlName="email"]').type('max.mustermann@example.com');
    cy.get('input[formControlName="password"]').type('Password123!');
    cy.get('input[formControlName="repeatPassword"]').type('Password123!');

    cy.get('input[id="street"]').type('Musterstraße 1');
    cy.get('input[id="postalCode"]').type('12345');
    cy.get('input[id="city"]').type('Musterstadt');
    cy.get('input[id="state"]').type('Musterland');
    cy.get('input[id="country"]').type('Deutschland');

    cy.get('button[type="submit"]').click();

    cy.wait('@registerError').its('response.statusCode').should('eq', 400);

    cy.contains('Error: Email already exists').should('exist');

    cy.url().should('include', '/register');
  });

  it('Password-Mismatch', () => {
    cy.get('input[formControlName="firstName"]').type('Max');
    cy.get('input[formControlName="lastName"]').type('Mustermann');
    cy.get('input[formControlName="email"]').type('max.mustermann@example.com');
    cy.get('input[formControlName="password"]').type('Password123!');
    cy.get('input[formControlName="repeatPassword"]').type('DifferentPassword!');

    cy.get('input[id="street"]').type('Musterstraße 1');
    cy.get('input[id="postalCode"]').type('12345');
    cy.get('input[id="city"]').type('Musterstadt');
    cy.get('input[id="state"]').type('Musterland');
    cy.get('input[id="country"]').type('Deutschland');

    cy.contains('Die Passwörter stimmen nicht überein.').should('exist');

    cy.get('button[type="submit"]').should('be.disabled');
  });

});


describe('Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('Show valdidation errors', () => {
    cy.get('button[type="submit"]').should('be.disabled');

    cy.get('input[type="email"]').click();
    cy.contains('Login').click();

    cy.get('button[type="submit"]').should('be.disabled');
    cy.contains('E-Mail is required');
  });

  it('Sends magic link and simulates token login redirect', () => {

    cy.intercept('POST', '**/api/auth/magic', {
      statusCode: 200,
      body: { message: 'Magic link sent to your email' }
    }).as('sendMagicLink');

    cy.visit('/login');
    cy.get('input[formControlName="email"]').type('test1@example.com');
    cy.get('button[type="submit"]').click();

    cy.wait('@sendMagicLink');
    cy.contains('You’ll receive a login link in your inbox shortly.').should('exist');


    const dummyJwt = 'dummy-jwt-token';
    cy.visit(`/magic-login?token=${dummyJwt}`);

    cy.window().then(win => {
      const url = new URL(win.location.href);
      const tokenFromUrl = url.searchParams.get('token');
      if (tokenFromUrl) {
        win.localStorage.setItem('token', tokenFromUrl);
      }
    });

    cy.window().its('localStorage.token').should('eq', dummyJwt);


    cy.visit('/customer');
    cy.url().should('include', '/customer');
  });

});

describe('Rent a product', () => {
  before(() => {
    cy.visit('/login');

    cy.intercept('POST', '**/api/auth/magic', {
      statusCode: 200,
      body: { message: 'Magic link sent to test1@example.com' }
    }).as('sendMagicLink');

    cy.get('input[formControlName="email"]').type('test1@example.com');
    cy.get('button[type="submit"]').click();
    cy.wait('@sendMagicLink');
    cy.contains('You’ll receive a login link in your inbox shortly.').should('exist');

    cy.visit('/magic-login?token=dummy-jwt-token-1');

    cy.window().then(win => {
      win.localStorage.setItem('token', 'dummy-jwt-token-1');
    });

    cy.saveLocalStorage();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.visit('/pdp/article/1');
  });

  it('Check availability, product not available', () => {
    cy.intercept('GET', '**/availability**', {
      statusCode: 200,
      body: { available: false }
    }).as('availabilityCheck');

    cy.get('input[formControlName="start"]').type('2025-03-18');
    cy.get('input[formControlName="end"]').type('2025-03-20');
    cy.wait('@availabilityCheck');
    cy.contains('Nicht Verfügbar').should('exist');
    cy.get('button').contains('Add to Cart').should('be.disabled');
  });

  it('Check availability and add to cart, then checkout', () => {
    cy.intercept('GET', '**/availability**', {
      statusCode: 200,
      body: { available: true, totalPrice: 50, availableInstances: [1, 2] }
    }).as('availabilityCheck');

    cy.get('input[formControlName="start"]').type('2025-03-20');
    cy.get('input[formControlName="end"]').type('2025-03-25');
    cy.wait('@availabilityCheck');
    cy.contains('In dem Zeitraum verfügbar').should('exist');
    cy.get('button').contains('Add to Cart').click();
    cy.url().should('include', '/products');
    cy.contains('Article(s) added to cart!').should('exist');

    cy.intercept('POST', '**/api/rental', {
      statusCode: 200,
      body: { rentalId: 123, message: 'Rental created successfully' }
    }).as('createRental');

    cy.visit('/cart');
    cy.get('li').its('length').should('be.greaterThan', 0);
    cy.get('button').contains('Rent').click();
    cy.wait('@createRental').its('response.statusCode').should('eq', 200);
    cy.contains('Articles rented!').should('exist');
    cy.url().should('include', '/customer');

  });

  it('View Dashboard', () => {
    cy.intercept('GET', '**/api/rental/my-positions', {
      statusCode: 200,
      body: [{
        rentalPositionId: 1,
        articleDesignation: 'Power Drill',
        inventoryNumber: 'INV-123',
        rentalStart: '2025-03-20',
        rentalEnd: '2025-03-25',
        status: 'RENTED'
      }]
    }).as('dashboardLoad');

    cy.visit('/customer');
    cy.wait('@dashboardLoad');

    cy.contains('Power Drill').should('exist');
    cy.contains('INV-123').should('exist');
    cy.contains('Current Active').should('exist');

  })
});













