apiUrl = Cypress.env('apiUrl');
const householdId = '5d588bb9-440a-44b1-bcc0-c9e195797033';

describe('Test household page', () => {
  beforeEach(() => {
    cy.clearAllCookies();
    const testToken = 'TestTokenFromMockBackend';
    const username = 'nico';
    cy.setCookie(
      'userInfo',
      JSON.stringify({ accessToken: testToken, username: username, role: 'USER' }),
    );

    cy.intercept('GET', `${apiUrl}api/v1/private/households/user/nico`, {
      statusCode: 200,
      body: {
        household: householdId,
        username: 'nico',
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'email@email.com',
        householdRole: 'OWNER',
      },
    });

    cy.intercept('GET', `${apiUrl}api/v1/private/stats/household/${householdId}/total`, {
      statusCode: 200,
      body: 100,
    });
    cy.intercept('GET', `${apiUrl}api/v1/private/stats/household/${householdId}`, {
      statusCode: 200,
      body: [
        {
          foodProduct: {
            id: '5d588bb9-440a-44b1-bcc0-c9e195797033',
            name: 'Egg',
          },
          householdId: householdId,
          amount: 1,
          thrownAmountInPercentage: '100',
          date: '2023-03-03',
        },
      ],
    });

    cy.intercept('DELETE', `${apiUrl}api/v1/private/households/${householdId}`, {
      statusCode: 204,
    });

    cy.intercept('GET', `${apiUrl}api/v1/private/stats/household/${householdId}/total/**`, {
      statusCode: 200,
      body: 10,
    });

    cy.intercept('GET', `${apiUrl}api/v1/private/households/${householdId}`, {
      statusCode: 201,
      body: {
        id: '5d588bb9-440a-44b1-bcc0-c9e195797033',
        name: 'Hytta på fjellet',
        members: [
          {
            household: '5d588bb9-440a-44b1-bcc0-c9e195797033',
            username: 'nico',
            firstName: 'Nicolai',
            lastName: 'Hansen',
            householdRole: 'OWNER',
          },
          {
            household: '5d588bb9-440a-44b1-bcc0-c9e195797033',
            username: 'carl',
            firstName: 'Carl',
            lastName: 'Hansen',
            householdRole: 'PRIVILEGED-USER',
          },
          {
            household: '5d588bb9-440a-44b1-bcc0-c9e195797033',
            username: 'olga',
            firstName: 'Olga',
            lastName: 'CarlSin',
            householdRole: 'MEMBER',
          },
          {
            household: '5d588bb9-440a-44b1-bcc0-c9e195797033',
            username: 'turid',
            firstName: 'Turid',
            lastName: 'CarlSin',
            householdRole: 'MEMBER',
          },
        ],
      },
    });

    cy.visit(`/household/${householdId}`);
  });

  it('Test household name and list of members', () => {
    cy.get('[data-testid="members-btn"]').should('exist').click();

    cy.get('[data-testid="name"]').should('exist').should('contain', 'Hytta på fjellet');
    /* usernames are present */
    cy.get('[data-testid="nico"]').should('exist').should('contain', 'Nicolai Hansen');
    cy.get('[data-testid="carl"]').should('exist').should('contain', 'Carl Hansen');
    cy.get('[data-testid="olga"]').should('exist').should('contain', 'Olga CarlSin');
    cy.get('[data-testid="turid"]').should('exist').should('contain', 'Turid CarlSin');
  });

  it('Test household settings page is available for owner', () => {
    cy.intercept('PUT', `${apiUrl}api/v1/private/households/*`, {
      statusCode: 200,
      body: {
        id: '5d588bb9-440a-44b1-bcc0-c9e195797033',
        name: 'Hytta på fjellet - endret',
        members: [
          {
            household: '5d588bb9-440a-44b1-bcc0-c9e195797033',
            username: 'nico',
            householdRole: 'OWNER',
          },
          {
            household: '5d588bb9-440a-44b1-bcc0-c9e195797033',
            username: 'carl',
            householdRole: 'PRIVILEGED-USER',
          },
          {
            household: '5d588bb9-440a-44b1-bcc0-c9e195797033',
            username: 'olga',
            householdRole: 'MEMBER',
          },
          {
            household: '5d588bb9-440a-44b1-bcc0-c9e195797033',
            username: 'turid',
            householdRole: 'MEMBER',
          },
        ],
      },
    });
    cy.get('[data-testid="settings-btn"]').should('exist').click();
    cy.get('[data-testid="edit-name-input"]').should('exist').type(' - endret');
    cy.get('[data-testid="save-name-button"]').should('exist').click();
    cy.get('[data-testid="delete-household-btn"]').should('exist').type(' - endret');
  });

  it('Test household name is editable by owner', () => {
    cy.intercept('PUT', `${apiUrl}api/v1/private/households/*`, {
      statusCode: 201,
      body: {
        id: '5d588bb9-440a-44b1-bcc0-c9e195797033',
        name: 'Hytta på fjellet - endret',
        members: [
          {
            household: '5d588bb9-440a-44b1-bcc0-c9e195797033',
            username: 'nico',
            householdRole: 'OWNER',
          },
          {
            household: '5d588bb9-440a-44b1-bcc0-c9e195797033',
            username: 'carl',
            householdRole: 'PRIVILEGED-USER',
          },
          {
            household: '5d588bb9-440a-44b1-bcc0-c9e195797033',
            username: 'olga',
            householdRole: 'MEMBER',
          },
          {
            household: '5d588bb9-440a-44b1-bcc0-c9e195797033',
            username: 'turid',
            householdRole: 'MEMBER',
          },
        ],
      },
    });
    cy.get('[data-testid="settings-btn"]').should('exist').click();
    cy.get('[data-testid="edit-name-input"]').should('exist').type(' - endret');
    cy.get('[data-testid="save-name-button"]').should('exist').click();
  });

  it('Test owner can add new members to a household', () => {
    cy.get('[data-testid="settings-btn"]').should('exist').click();
    cy.get('[data-testid="new-member-name"]').should('exist').type('gorm');
  });

  it('At least one canvas is loaded in on statistics view', () => {
    cy.get('[data-testid="stats-btn"]').should('exist').click();
    cy.get('canvas').should('exist');
  });
});
