import { gqlQuery, injectWeb3 } from '../util';

let circleId;

context('Coordinape', () => {
  before(() => {
    const providerPort = Cypress.env('HARDHAT_GANACHE_PORT');
    Cypress.on('window:before:load', injectWeb3(providerPort));
    return gqlQuery({
      circles: [{ where: { name: { _eq: 'Sports' } } }, { id: true }],
    }).then(q => {
      circleId = q.circles[0].id;
    });
  });
  it('can create new epoch with default parameters', () => {
    cy.visit(`/circles/${circleId}/history`);
    cy.login();

    cy.contains('Sports', { timeout: 120000 });
    cy.contains('There are no scheduled epochs');
    cy.contains('Create Epoch', { timeout: 45000 }).click();
    cy.contains('Save').click();
    cy.contains('starts in 23 hr', { timeout: 120000 });
  });
});
