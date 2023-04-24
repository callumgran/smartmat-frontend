apiUrl = Cypress.env('apiUrl');

describe('Test logged in user using the household view page', () => {
  beforeEach(() => {
    cy.clearAllCookies();
    const testToken = 'TestTokenFromMockBackend';
    const username = 'TestUser';
    cy.setCookie(
      'userInfo',
      JSON.stringify({ accessToken: testToken, username: username, role: 'USER' }),
    );
    cy.visit('/household');
  });

  it('Test page displays all household names', () => {
    cy.intercept('GET', `${apiUrl}api/v1/private/households/user/TestUser`, {
      statusCode: 200,
      body: [
        {
          id: '02f2b2cf-5143-4d3f-b9df-3843c9791dac',
          name: 'kollektivet',
        },
        {
          id: 'f43b4404-1b80-4e75-9e07-8645262d7f5e',
          name: 'hytta',
        },
      ],
    });

    cy.get('[data-testid="kollektivet"]').should('exist');
    cy.get('[data-testid="hytta"]').should('exist');
    cy.get('[data-testid="noe-annet"]').should('not.exist');
  });

  it('Test page displays create new household button', () => {
    cy.intercept('GET', `${apiUrl}api/v1/private/households/user/TestUser`, {
      statusCode: 200,
      body: [
        {
          id: '02f2b2cf-5143-4d3f-b9df-3843c9791dac',
          name: 'kollektivet',
        },
        {
          id: 'f43b4404-1b80-4e75-9e07-8645262d7f5e',
          name: 'hytta',
        },
      ],
    });

    cy.get('[data-testid="create-household-button"]').should('exist');
  });

  it('Test clicking create household button redirects to create household page', () => {
    cy.intercept('GET', `${apiUrl}api/v1/private/households/user/TestUser`, {
      statusCode: 200,
      body: [
        {
          id: '02f2b2cf-5143-4d3f-b9df-3843c9791dac',
          name: 'kollektivet',
        },
        {
          id: 'f43b4404-1b80-4e75-9e07-8645262d7f5e',
          name: 'hytta',
        },
      ],
    });

    cy.get('[data-testid="create-household-button"]').should('exist').click();
    cy.url().should('include', 'create');
  });
});
