let apiUrl = Cypress.env('apiUrl');

describe('Test user using the login page', () => {
  beforeEach(() => {
    cy.clearAllCookies();
    cy.visit('/');
    cy.visit('/login');
  });

  it('Test user logging in saves a token in localstorage', () => {
    const testToken = 'TestTokenFromMockBackend';
    const username = 'TestUser';
    cy.intercept('POST', `${apiUrl}api/v1/public/token`, {
      statusCode: 200,
      body: testToken,
    });
    cy.intercept('GET', `${apiUrl}api/v1/private/users/me`, {
      statusCode: 200,
      body: {
        id: 1,
        username: username,
        email: '',
        role: 'USER',
        firstName: '',
        lastName: '',
      },
    });

    cy.get('[data-testid="username"]').should('exist').type(username);
    cy.get('[data-testid="password"]').type('testPassword123');
    cy.get('[data-testid="login-user-button"]').click().wait(1000);
    cy.getCookie('userInfo')
      .should('have.property', 'value')
      .then((value) => {
        expect(value).to.include(testToken);
      });
  });

  it('Test pressing submit is not possible if password field is empty', () => {
    cy.get('[data-testid="username"]').should('exist').type('TestUser');
    cy.get('[data-testid="login-user-button"]').should('be.disabled');
  });

  it('Test pressing register button redirects to register new user page', () => {
    cy.get('[data-testid="goto-register-user-button"]').click();
    cy.url().should('include', '/register');
  });
});
