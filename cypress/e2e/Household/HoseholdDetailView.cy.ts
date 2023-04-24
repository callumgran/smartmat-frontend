apiUrl = Cypress.env('apiUrl');
const householdId = '59435e5b-91f4-4ed8-b73e-4a8ff0bcc730';

describe('Test household detail page', () => {
  beforeEach(() => {
    cy.clearAllCookies();
    const testToken = 'TestTokenFromMockBackend';
    const username = 'nico';
    cy.setCookie(
      'userInfo',
      JSON.stringify({ accessToken: testToken, username: username, role: 'USER' }),
    );

    cy.intercept('GET', `${apiUrl}api/v1/private/households/${householdId}`, {
      statusCode: 201,
      body: {
        id: '5d588bb9-440a-44b1-bcc0-c9e195797033',
        name: 'Hytta på fjellet',
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

    cy.visit(`/household/${householdId}`);
  });

  it('Test page household name and list of members', () => {
    cy.get('[data-testid="name"]').should('exist').should('contain', 'Hytta på fjellet');
    /* usernames are present */
    cy.get('[data-testid="nico"]').should('exist').should('contain', 'nico');
    cy.get('[data-testid="carl"]').should('exist').should('contain', 'carl');
    cy.get('[data-testid="olga"]').should('exist').should('contain', 'olga');
    cy.get('[data-testid="turid"]').should('exist').should('contain', 'turid');
  });

  it('Test household name is editable for owner', () => {
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
    cy.get('[data-testid="edit-name-button"]').should('exist').click();
    cy.get('[data-testid="edit-name-input"]').should('exist').type(' - endret');
    cy.get('[data-testid="save-name-button"]').should('exist').click();
    cy.get('[data-testid="name"]').should('exist').should('contain', 'Hytta på fjellet - endret');
  });

  it('Test household name is not editable regular user', () => {
    cy.clearAllCookies();
    const testToken = 'TestTokenFromMockBackend';
    const username = 'olga';
    cy.setCookie(
      'userInfo',
      JSON.stringify({ accessToken: testToken, username: username, role: 'USER' }),
    );

    cy.visit('/household');
    cy.visit(`/household/${householdId}`);
    cy.get('[data-testid="edit-name-button"]').should('not.exist');
  });

  it('Test owner can add new members to a household', () => {
    cy.get('[data-testid="new-member-name"]').should('exist').type('gorm');
  });
});
