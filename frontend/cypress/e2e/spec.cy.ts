describe('Home page', () => {
  it('Visits the landing page', () => {
    cy.visit('/')
    cy.contains('High-quality equipment. Simply rented.')
  })
})

/*describe('Register as Private Client', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('register successfully', () => {

    cy.intercept('POST', '**!/api/auth/register', {
      statusCode: 200,
      body: {
        userId: 1,
        token: 'dummy-token',
        role: 'PRIVATE_CLIENT'
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

    cy.wait('@registerRequest').its('response.statusCode').should('eq', 200);

    cy.url().should('include', '/login');

    cy.contains('Registered successfully!').should('exist');
  });

  it('Failed login, email already exists', () => {
    cy.intercept('POST', '**!/api/auth/register', {
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

  it('Passwort-Mismatch', () => {
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

  it('Show valdidation errors if no inputs are made', () => {
    cy.get('button[type="submit"]').should('be.disabled');

    cy.get('input[type="email"]').click();
    cy.get('input[type="password"]').click();
    cy.get('input[type="email"]').click();

    cy.get('button[type="submit"]').should('be.disabled');


    cy.contains('E-Mail is required');
    cy.contains('Password is required');
  });

  it('Login as Admin', () => {

    cy.intercept('POST', '**!/api/auth/login', {
      statusCode: 200,
      body: { token: 'dummy-token', userId: 1, role: 'ADMIN' },
    }).as('loginSuccess');

    cy.get('input[formControlName="email"]').type('test@example.com');
    cy.get('input[formControlName="password"]').type('Password123!');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginSuccess');

    cy.url().should('include', '/admin');

    cy.window()
        .its('localStorage')
        .invoke('getItem', 'token')
        .should('exist');
  });

  it('Login as Customer', () => {

    cy.intercept('POST', '**!/api/auth/login', {
      statusCode: 200,
      body: { token: 'dummy-token-1', userId: 2, role: 'PRIVATE_CLIENT' },
    }).as('loginSuccess');

    cy.get('input[formControlName="email"]').type('test1@example.com');
    cy.get('input[formControlName="password"]').type('Password123!');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginSuccess');

    cy.url().should('include', '/customer');

    cy.window()
        .its('localStorage')
        .invoke('getItem', 'token')
        .should('exist');
  });

  it('Login as Staff', () => {

    cy.intercept('POST', '**!/api/auth/login', {
      statusCode: 200,
      body: { token: 'dummy-token', userId: 3, role: 'STAFF' },
    }).as('loginSuccess');

    cy.get('input[formControlName="email"]').type('test3@example.com');
    cy.get('input[formControlName="password"]').type('Password123!');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginSuccess');

    cy.url().should('include', '/admin');

    cy.window()
        .its('localStorage')
        .invoke('getItem', 'token')
        .should('exist');
  });

  it('Login with bad credentials', () => {
    cy.intercept('POST', '**!/api/auth/login', {
      statusCode: 403,
      body: { message: 'Bad credentials' },
    }).as('loginFail');

    cy.get('input[formControlName="email"]').type('wrong@example.com');
    cy.get('input[formControlName="password"]').type('wrongPassword');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginFail');
    cy.contains('Bad credentials').should('exist');
    cy.window()
        .its('localStorage')
        .invoke('getItem', 'token')
        .should('be.null');
  });

});*/

describe('Rent a product', () => {
  before(() => {
    cy.visit('/login');
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: { token: 'dummy-jwt-token-1', userId: 2, role: 'PRIVATE_CLIENT' },
    }).as('loginSuccess');

    cy.get('input[formControlName="email"]').type('test1@example.com');
    cy.get('input[formControlName="password"]').type('Password123!');
    cy.get('button[type="submit"]').click();
    cy.wait('@loginSuccess');
    cy.url().should('include', '/customer');

    // Manuell Token setzen, falls nicht automatisch erfolgt
    cy.window().then(win => {
      win.localStorage.setItem('token', 'dummy-jwt-token-1');
    });
    // Speichere den Local Storage
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    // Stelle sicher, dass der gespeicherte Local Storage wiederhergestellt wird
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
});










