import { injectWeb3 } from '../util';

context('Coordinape', () => {
  before(() => {
    const providerPort = Cypress.env('HARDHAT_GANACHE_PORT');
    Cypress.on('window:before:load', injectWeb3(providerPort));
  });
  it('can create a nominee', () => {
    cy.visit('/circles');
    cy.login();
    // This is highly dependent upon how our seed is constructed..
    cy.url({ timeout: 120000 }).should('include', '/circles');
    // Kids is a circle w/ an ended epoch, the Admin button is a child of a peer element
    cy.contains('Movies', { timeout: 120000 })
      .parent()
      .parent()
      .within(() => {
        cy.get('.hover-buttons').invoke('show');
        cy.get('a').contains('Vouching').click();
      });
    cy.url({ timeout: 120000 }).should('include', '/vouching');
    cy.contains('Nominate New Member', { timeout: 60000 }).click();
    // enter the nominee creation modal and fill it out
    cy.get('[name=name]').click().type('Satoshi');
    cy.get('[name=address]')
      .click()
      .type('0x51508887C3FEf0b4390091C5A4B2B91562881526');
    cy.contains('Why are you nominating')
      .click()
      .type("It's annoying that I need to fill forty whole characters here.");
    cy.contains('Nominate Member').click();
    cy.contains('Vouch for Satoshi', { timeout: 120000 });
    //cy.contains('GQL Query Error', { timeout: 45000 }).should('not.exist');
  });
});
