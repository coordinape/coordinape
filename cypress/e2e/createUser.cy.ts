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

  after(() => {
    // might want something more surgical and lightweight
    // to facilitate faster idempotent testing
    // cy.exec('yarn db-seed-fresh');
  });
  it('can create a new user with fixed payment amount', () => {
    cy.visit(`/circles/${circleId}/members`);
    cy.login();

    cy.contains('Add Members', { timeout: 120000 }).should('be.visible');
    cy.contains('Add Members').click();

    cy.contains('ETH Address', { timeout: 120000 }).should('be.visible');
    cy.contains('ETH Address').click();

    cy.get('[data-testid=new-members]').within(() => {
      cy.get('input').eq(0).click().type('A Test User');
      cy.get('input')
        .eq(1)
        .click()
        .type('0xe00b84525b71ef52014e59f633c97530cb278e09');
    });

    cy.get('button')
      .contains('Add Members', { timeout: 120000 })
      .should('be.enabled');
    cy.get('button').contains('Add Members').click();
    cy.contains('You have added 1 member!', { timeout: 120000 }).should(
      'be.visible'
    );
    cy.get('button').contains('Back').click();
    cy.contains('A Test User', { timeout: 120000 }).should('be.visible');
  });
});
