apiUrl = Cypress.env('apiUrl');

describe('Test user using the create household view page', () => {
  beforeEach(() => {
    cy.clearAllCookies();
    cy.visit('/household/create');
  });

  it('Test page displays form and submit button', () => {
    /* form input for name of new household */
    cy.get('[data-testid="name"]').should('exist');
    cy.get('[data-testid="create-household-button"]').should('exist');
  });

  it('Test typing a valid name and submitting redirects to page of households', () => {
    cy.intercept('POST', `${apiUrl}api/v1/private/households`, {
      statusCode: 201,
      body: {
        id: '59435e5b-91f4-4ed8-b73e-4a8ff0bcc730',
        name: 'hytta',
        members: [
          {
            household: '59435e5b-91f4-4ed8-b73e-4a8ff0bcc730',
            username: 'nico',
            householdRole: 'OWNER',
          },
        ],
      },
    });

    cy.get('[data-testid="name"]').should('exist').type('hytta');
    cy.get('[data-testid="create-household-button"]').should('exist').click();
    cy.url().should('include', '/household');
  });

  it('Test typing an invalid name and submitting gives error', () => {
    cy.get('[data-testid="name"]').should('exist').type('h');
    cy.get('[data-testid="create-household-button"]').should('exist').click();

    /* no redirection */
    cy.url().should('include', '/household/create');
  });
});
