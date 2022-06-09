import { injectWeb3 } from '../util';

context('Coordinape', () => {
  before(() => {
    const providerPort = Cypress.env('HARDHAT_GANACHE_PORT');
    Cypress.on('window:before:load', injectWeb3(providerPort));
  });
  it('can update fixed payment token', () => {
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
        cy.get('a').contains('Admin').click();
      });
    cy.url({ timeout: 120000 }).should('match', /circles\/\d+\/admin/);
    cy.contains('Settings').click();
    cy.contains('Fixed Payment Token')
      .parent()
      .within(() => {
        cy.get('input').clear().type('DAI').blur();
      });
    cy.intercept({
      method: 'POST',
      url: '/v1/graphql',
    }).as('saveCircle');
    cy.contains('Save').click();
    cy.wait('@saveCircle').its('response.statusCode').should('equal', 200);
    cy.intercept({
      method: 'POST',
      url: '/v1/graphql',
    }).as('hardReload');
    cy.reload(true);
    cy.wait('@hardReload').its('response.statusCode').should('equal', 200);
    cy.contains('Settings', { timeout: 120000 }).click();
    cy.contains('Fixed Payment Token')
      .parent()
      .within(() => {
        cy.get('input').should('have.value', 'DAI');
      });
  });
});
