apiUrl = Cypress.env('apiUrl');

describe('Test user using the register page', () => {
  beforeEach(() => {
    cy.clearAllCookies();
    cy.visit('/register');
  });

  it('Test user registering saves a token in localstorage', () => {
    const testToken = 'TestTokenFromMockBackend';
    const username = 'newRegisteredUser';
    const firstName = 'my name';
    const lastName = 'my last name';
    const email = `${username}@example.com`;
    const password = 'testPassword123';
    cy.intercept('POST', `${apiUrl}api/v1/public/token`, {
      statusCode: 201,
      body: testToken,
    });
    cy.intercept('POST', `${apiUrl}api/v1/public/users`, {
      statusCode: 201,
    });
    cy.intercept('GET', `${apiUrl}api/v1/private/users/me`, {
      statusCode: 200,
      body: { username: username, firstName: firstName, lastName: lastName, email: email, roles: ['user'] },
    });

    cy.get('[data-testid="username"]', { timeout: 10000 }).should('exist').type(username);
    cy.get('[data-testid="email"]').type(email);
    cy.get('[data-testid="firstname"]').type(firstName);
    cy.get('[data-testid="lastname"]').type(lastName);
    cy.get('[data-testid="password"]').type(password);
    cy.get('[data-testid="repeat-password"]').type(password);
    cy.get('[data-testid="create-user-button"]').click().wait(1000);
    cy.getCookie('userInfo')
      .should('have.property', 'value')
      .then((value) => {
        expect(value).to.include(testToken);
      });
  });

  it('Test not repeating coorect password does not register new user and gives error', () => {
    const username = 'newRegisteredUser';
    cy.intercept('POST', `${apiUrl}api/v1/public/token`, {
      statusCode: 201,
      body: 'TestTokenFromMockBackend',
    });
    cy.intercept('POST', `${apiUrl}api/v1/public/users`, {
      statusCode: 409,
    });

    cy.get('[data-testid="username"]', { timeout: 10000 }).should('exist').type(username);
    cy.get('[data-testid="email"]').type(`${username}@example.com`);
    cy.get('[data-testid="firstname"]').type('my name');
    cy.get('[data-testid="lastname"]').type('my last name');
    cy.get('[data-testid="password"]').type('testPassword123');
    cy.get('[data-testid="repeat-password"]').type('testPassword1234');
    cy.get('[data-testid="create-user-button"]').click().wait(1000);

    // TODO: find a better solution.
    // This is a workaround for vuetify. I don't know how to set a test-id on an error yet.
    cy.getAllCookies().then((result) => {
      expect(result).to.deep.equal([]);
    });
  });

  it('Test omitting required form input field does not register new user', () => {
    const username = 'newRegisteredUser';
    cy.intercept('POST', `${apiUrl}api/v1/public/token`, {
      statusCode: 201,
      body: 'TestTokenFromMockBackend',
    });
    cy.intercept('POST', `${apiUrl}api/v1/public/users`, {
      statusCode: 409,
    });

    cy.get('[data-testid="username"]', { timeout: 10000 }).should('exist').type(username);
    cy.get('[data-testid="email"]').type(`${username}@example.com`);
    cy.get('[data-testid="firstname"]').type('my name');
    cy.get('[data-testid="password"]').type('testPassword123');
    cy.get('[data-testid="repeat-password"]').type('testPassword123');
    cy.get('[data-testid="create-user-button"]').click().wait(1000);

    cy.getAllCookies().then((result) => {
      expect(result).to.deep.equal([]);
    });
  });
});
