import { injectWeb3 } from '../util';

context('Coordinape', () => {
  before(() => {
    const providerPort = Cypress.env('HARDHAT_GANACHE_PORT');
    Cypress.on('window:before:load', injectWeb3(providerPort));
  });
  it('can create new epoch with default parameters', () => {
    cy.visit('/circles');
    cy.login();
    // This is highly dependent upon how our seed is constructed..
    cy.url({ timeout: 120000 }).should('include', '/circles');
    // Sports is a circle w/ an ended epoch, the Admin button is a child of a peer element
    cy.contains('Sports', { timeout: 120000 })
      .parent()
      .parent()
      .within(() => {
        cy.get('.hover-buttons').invoke('show');
        cy.get('a').contains('Admin', { timeout: 45000 }).click();
      });

    // now we go to the admin page
    cy.url({ timeout: 120000 }).should('match', /circles\/\d+\/admin/);
    cy.contains('Sports');
    cy.contains('Epoch 2').should('not.exist');
    cy.contains('Create Epoch', { timeout: 45000 }).click();
    cy.contains('Save').click();
    cy.contains('Epoch 2', { timeout: 120000 });
    // Would be nice to test for this error not happening, but it times out immediately
    // cy.contains('GQL Query Error', { timeout: 15000 }).should('not.exist');
  });
});
