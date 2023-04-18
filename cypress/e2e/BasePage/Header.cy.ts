describe('Testing the header component', () => {
  it('Clicking on drawer button shows app drawer', () => {
    cy.visit('/');
    cy.get("[data-testid='navbar-drawer-button']").click();
    cy.get("[data-testid='drawer-link-list']").should('exist');
  });
  it('Navigation bar shows title for the current page', () => {
    cy.visit('/');
    cy.get("[data-testid='navbar-title']").should('exist');
    cy.get("[data-testid='navbar-title']").should('contain', 'SmartMat');
  });
});
