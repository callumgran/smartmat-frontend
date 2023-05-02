apiUrl = Cypress.env('apiUrl');

describe('Test recipe list page', () => {
  beforeEach(() => {
    cy.clearAllCookies();
    const testToken = 'TestTokenFromMockBackend';
    const username = 'TestUser';
    cy.setCookie(
      'userInfo',
      JSON.stringify({ accessToken: testToken, username: username, role: 'USER' }),
    );

    cy.intercept('GET', `${apiUrl}api/v1/private/recipes`, {
      statusCode: 200,
      body: [
        {
          id: '7e023dcc-b45a-40b1-b1c4-8f17a95b17bb',
          name: 'Eilor spaghet',
          description: 'Eilor sin klassiske spaghet med en vri fra morsi',
          ingredients: [
            {
              ingredient: {
                id: 2,
                name: 'spaghetti',
                unit: {
                  name: 'kilogram',
                  abbreviation: 'kg',
                  toNormalFormConversionFactor: 1.0,
                  unitType: 'SOLID',
                },
              },
              amount: 1.0,
            },
          ],
          instructions: '1. yo.',
          estimatedMinutes: 35,
          recipeDifficulty: 'ADVANCED',
        },
        {
          id: 'c5314fba-9693-4012-b595-cd15378e9c50',
          name: 'Eilor lol',
          description: 'Eilor sin klassiske lol med en vri fra morsi',
          ingredients: [
            {
              ingredient: {
                id: 1,
                name: 'sukker',
                unit: {
                  name: 'kilogram',
                  abbreviation: 'kg',
                  toNormalFormConversionFactor: 1.0,
                  unitType: 'SOLID',
                },
              },
              amount: 0.5,
            },
          ],
          instructions: '1. yo.',
          estimatedMinutes: 35,
          recipeDifficulty: 'ADVANCED',
        },
        {
          id: 'f0fcf7e4-98e7-47b1-88e6-73dd0f41e48c',
          name: 'Boras Goulash',
          description: 'Beef goulash laget på bera sin avøde grandonkel',
          ingredients: [
            {
              ingredient: {
                id: 2,
                name: 'spaghetti',
                unit: {
                  name: 'kilogram',
                  abbreviation: 'kg',
                  toNormalFormConversionFactor: 1.0,
                  unitType: 'SOLID',
                },
              },
              amount: 1.0,
            },
            {
              ingredient: {
                id: 1,
                name: 'sukker',
                unit: {
                  name: 'kilogram',
                  abbreviation: 'kg',
                  toNormalFormConversionFactor: 1.0,
                  unitType: 'SOLID',
                },
              },
              amount: 2.0,
            },
            {
              ingredient: {
                id: 4,
                name: 'indrefilet',
                unit: {
                  name: 'gram',
                  abbreviation: 'g',
                  toNormalFormConversionFactor: 0.001,
                  unitType: 'SOLID',
                },
              },
              amount: 200.0,
            },
          ],
          instructions: '1. mordi. 2 voila',
          estimatedMinutes: 35,
          recipeDifficulty: 'EASY',
        },
      ],
    });

    cy.visit('/recipe');
  });

  it('Test page displays all recipes names', () => {
    cy.get('[data-testid="7e023dcc-b45a-40b1-b1c4-8f17a95b17bb-card"]')
      .should('exist')
      .should('contain', 'Eilor spaghet');
    cy.get('[data-testid="c5314fba-9693-4012-b595-cd15378e9c50-card"]')
      .should('exist')
      .should('contain', 'Eilor lol');
    cy.get('[data-testid="f0fcf7e4-98e7-47b1-88e6-73dd0f41e48c-card"]')
      .should('exist')
      .should('contain', 'Boras Goulash');
  });

  it('Test search filter only returns matching recipes', () => {
    cy.intercept('POST', `${apiUrl}api/v1/private/recipes/search`, {
      statusCode: 200,
      body: [
        {
          id: 'c5314fba-9693-4012-b595-cd15378e9c50',
          name: 'Eilor lol',
          description: 'Eilor sin klassiske lol med en vri fra morsi',
          ingredients: [
            {
              ingredient: {
                id: 1,
                name: 'sukker',
                unit: {
                  name: 'kilogram',
                  abbreviation: 'kg',
                  toNormalFormConversionFactor: 1.0,
                  unitType: 'SOLID',
                },
              },
              amount: 0.5,
            },
          ],
          instructions: '1. yo.',
          estimatedMinutes: 35,
          recipeDifficulty: 'ADVANCED',
        },
        {
          id: '7e023dcc-b45a-40b1-b1c4-8f17a95b17bb',
          name: 'Eilor spaghet',
          description: 'Eilor sin klassiske spaghet med en vri fra morsi',
          ingredients: [
            {
              ingredient: {
                id: 2,
                name: 'spaghetti',
                unit: {
                  name: 'kilogram',
                  abbreviation: 'kg',
                  toNormalFormConversionFactor: 1.0,
                  unitType: 'SOLID',
                },
              },
              amount: 1.0,
            },
          ],
          instructions: '1. yo.',
          estimatedMinutes: 35,
          recipeDifficulty: 'ADVANCED',
        },
      ],
    });

    cy.get('[data-testid="search-input"]').type('E');

    cy.get('[data-testid="7e023dcc-b45a-40b1-b1c4-8f17a95b17bb-card"]')
      .should('exist')
      .should('contain', 'Eilor spaghet');
    cy.get('[data-testid="c5314fba-9693-4012-b595-cd15378e9c50-card"]')
      .should('exist')
      .should('contain', 'Eilor lol');
    cy.get('[data-testid="f0fcf7e4-98e7-47b1-88e6-73dd0f41e48c-card"]').should('not.exist');
  });
});
