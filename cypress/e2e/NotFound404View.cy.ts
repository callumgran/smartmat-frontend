apiUrl = Cypress.env('apiUrl');
const baseUrl = (Cypress.config().baseUrl = Cypress.config().baseUrl.replace('*', ''));

describe('Test 404-not-found redirection', () => {
  beforeEach(() => {
    cy.clearAllCookies();
  });

  it('Test visiting an invalid url path redirects to the not found page', () => {
    cy.visit('/invalid-url-path');
    cy.get('[data-testid="not-found-header"]').should('exist');
    cy.url().should('include', '/not-found');
  });

  it('Test request returning a 404 redirects to the not found page', () => {
    cy.intercept('GET', `${apiUrl}api/v1/private/households/invalid-id`, {
      statusCode: 404,
    });

    cy.visit('/household/invalid-id');

    cy.get('[data-testid="not-found-header"]').should('exist');
    cy.url().should('include', '/not-found');
  });

  it('Test go back to main page from not found page', () => {
    cy.visit('/invalid-url-path');
    cy.get('[data-testid="not-found-header"]').should('exist');
    cy.url().should('include', '/not-found');

    cy.get('[data-testid="goto-main"]').should('exist').click();
    cy.url().should('equal', baseUrl);
  });
});
