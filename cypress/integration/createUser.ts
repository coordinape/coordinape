import { gqlQuery, injectWeb3 } from '../util';

let circleId;

context('Coordinape', () => {
  before(() => {
    const providerPort = Cypress.env('HARDHAT_GANACHE_PORT');
    Cypress.on('window:before:load', injectWeb3(providerPort));
    return gqlQuery({
      circles: [{ where: { name: { _eq: 'Garden' } } }, { id: true }],
    }).then(q => {
      circleId = q.circles[0].id;
    });
  });

  it('can create a new user with fixed payment amount', () => {
    cy.visit(`/circles/${circleId}/members`);
    cy.login();

    cy.contains('Add Contributor', { timeout: 120000 }).should('be.visible');
    cy.contains('Add Contributor').click();
    cy.contains('Contributor Name')
      .parent()
      .within(() => {
        cy.get('input').type('A Test User').blur();
      });
    cy.contains('Contributor ETH address')
      .parent()
      .within(() => {
        cy.get('input')
          .type('0xe00b84525b71ef52014e59f633c97530cb278e09')
          .blur();
      });
    // enter the fixed payment amount
    cy.contains('Create User')
      .parent()
      .within(() => {
        cy.contains('Fixed Payment Amount')
          .parent()
          .within(() => {
            // there seem to be a default 0 in a number input so we add one less 0
            cy.get('input').clear().type('1200').blur();
          });
      });

    cy.contains('Save').click();
    cy.reload(true);
    cy.contains('A Test User', { timeout: 120000 }).should('be.visible');
    // Verify new value in contributors table
    cy.contains('A Test User', { timeout: 120000 })
      .parents('tr')
      .within(() => {
        cy.get('td').eq(7).should('have.text', '12000');
      });
  });
});
