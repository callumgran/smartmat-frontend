describe('Testing the header component', () => {
  beforeEach(() => {
    cy.clearAllCookies();
  });

  it('Drawer button does not exist when not logged in', () => {
    cy.visit('/');
    cy.get("[data-testid='navbar-drawer-button']").should('not.exist');
  });

  it('Drawer button exists when logged in', () => {
    const testToken = 'TestTokenFromMockBackend';
    const username = 'TestUser';
    const role = 'ADMIN';
    cy.setCookie(
      'userInfo',
      JSON.stringify({ accessToken: testToken, username: username, role: role }),
    );
    cy.visit('/');
    cy.get("[data-testid='navbar-drawer-button']").should('exist');
  });

  it('Clicking on drawer button shows app drawer', () => {
    const testToken = 'TestTokenFromMockBackend';
    const username = 'TestUser';
    const role = 'ADMIN';
    cy.setCookie(
      'userInfo',
      JSON.stringify({ accessToken: testToken, username: username, role: role }),
    );
    cy.visit('/');
    cy.get("[data-testid='navbar-drawer-button']").click();
    cy.get("[data-testid='drawer-link-list']").should('exist');
  });

  it('Home button should exist when not logged in and at /login', () => {
    cy.visit('/login');
    cy.get("[data-testid='home-button']").should('exist');
  });

  it('Home button should exist when not logged in and clicking it should take user back to home', () => {
    cy.visit('/login');
    cy.get("[data-testid='home-button']").should('exist').click();
    cy.url().should('eq', 'http://localhost:4173/');
  });

  it('Navigation bar shows title for the current page', () => {
    cy.visit('/');
    cy.get("[data-testid='navbar-title']").should('exist');
    cy.get("[data-testid='navbar-title']").should('contain', 'SmartMat');
  });
});
