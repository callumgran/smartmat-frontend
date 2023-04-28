apiUrl = Cypress.env('apiUrl');
const householdUUID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

describe('Test household inventory', () => {
  beforeEach(() => {
    cy.clearAllCookies();
    const testToken = 'TestTokenFromMockBackend';
    const username = 'TestUser';
    cy.setCookie(
      'userInfo',
      JSON.stringify({ accessToken: testToken, username: username, role: 'USER' }),
    );

    cy.intercept('GET', `${apiUrl}api/v1/private/households/${householdUUID}`, {
      statusCode: 200,
      body: {
        id: householdUUID,
        name: 'Hytta på fjellet',
        members: [
          {
            household: householdUUID,
            username: 'TestUser',
            householdRole: 'OWNER',
          },
        ],
        foodProducts: [
          {
            id: '1',
            foodProduct: {
              id: 1,
              name: 'Tine Melk',
              amount: 0,
              looseWeight: false,
              ingredient: {
                id: 0,
                name: 'string',
                unit: {
                  name: 'string',
                  abbreviation: 'l',
                },
              },
              ean: 'string',
            },
            householdId: 'string',
            expirationDate: '2023-04-28',
            amountLeft: 1,
          },
        ],
      },
    });

    cy.visit(`/household/${householdUUID}/inventory`);
  });

  it('Page displays all items in inventory', () => {
    cy.get('[data-testid="inventory-table"]').should('exist');
    cy.get('[data-testid="1"]').should('exist').should('contain', 'Tine Melk');
  });

  it('Add item to inventory', () => {
    cy.intercept('POST', `${apiUrl}/api/v1/private/foodproducts/search`, {
      statusCode: 200,
      body: [
        {
          id: 1,
          name: 'Ost fra Brazil',
          amount: 10.0,
          looseWeight: false,
          ingredient: {
            id: 1,
            name: 'ost',
            unit: {
              name: 'gram',
              abbreviation: 'g',
            },
          },
          ean: 'string',
        },
      ],
    });

    cy.intercept('POST', `${apiUrl}api/v1/private/households/${householdUUID}/foodproducts`, {
      statusCode: 201,
      body: {
        id: '2',
        foodProduct: {
          id: 2,
          name: 'Ost fra Brazil',
          amount: 0,
          looseWeight: true,
          ingredient: {
            id: 0,
            name: 'string',
            unit: {
              name: 'string',
              abbreviation: 'string',
            },
          },
          ean: 'string',
        },
        householdId: 'string',
        expirationDate: '2023-04-28',
        amountLeft: 0,
      },
    });

    cy.get('[data-testid="add-foodproduct"]').click();

    cy.get('[data-testid="product_name"]').click().type('Ost');
    cy.get('[data-testid="suggestion-0"]').click();
    cy.get('[data-testid="amount"]').type('2');
    cy.get('[data-testid="date"]').type('2023-12-30');
    cy.get('[data-testid="add-item"]').click();

    cy.get('[data-testid="1"]').should('exist').should('contain', 'Tine Melk');
    cy.get('[data-testid="2"]').should('exist').should('contain', 'Ost fra Brazil');
  });

  it('Add item to inventory when amount is 0 is not possible', () => {
    cy.intercept('POST', `${apiUrl}/api/v1/private/foodproducts/search`, {
      statusCode: 200,
      body: [
        {
          id: 1,
          name: 'Ost fra Brazil',
          amount: 10.0,
          looseWeight: false,
          ingredient: {
            id: 1,
            name: 'ost',
            unit: {
              name: 'gram',
              abbreviation: 'g',
            },
          },
          ean: 'string',
        },
      ],
    });

    cy.intercept('POST', `${apiUrl}api/v1/private/households/${householdUUID}/foodproducts`, {
      statusCode: 201,
      body: {
        id: '2',
        foodProduct: {
          id: 2,
          name: 'Ost fra Brazil',
          amount: 0,
          looseWeight: true,
          ingredient: {
            id: 0,
            name: 'string',
            unit: {
              name: 'string',
              abbreviation: 'string',
            },
          },
          ean: 'string',
        },
        householdId: 'string',
        expirationDate: '2023-04-28',
        amountLeft: 0,
      },
    });

    cy.get('[data-testid="add-foodproduct"]').click();

    cy.get('[data-testid="product_name"]').click().type('Ost');
    cy.get('[data-testid="suggestion-0"]').click();
    cy.get('[data-testid="amount"]').type('0');
    cy.get('[data-testid="date"]').type('2023-12-30');
    cy.get('[data-testid="add-item"]').invoke('attr', 'disabled').should('exist');
  });
});
