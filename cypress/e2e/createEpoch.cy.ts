import { gqlQuery, injectWeb3 } from '../util';

let circleId, circleName;

context('Coordinape', () => {
  before(() => {
    const providerPort = Cypress.env('HARDHAT_GANACHE_PORT');
    Cypress.on('window:before:load', injectWeb3(providerPort));
    return gqlQuery({
      circles: [
        {
          where: { organization: { name: { _eq: 'Ended Epoch With Gifts' } } },
        },
        { id: true, name: true },
      ],
    }).then(q => {
      circleId = q.circles[0].id;
      circleName = q.circles[0].name;
    });
  });
  it('can create new epoch after changing parameters', () => {
    cy.visit(`/circles/${circleId}/history`);
    cy.login();

    cy.contains(circleName, { timeout: 120000 });
    cy.contains('There are no scheduled epochs');
    cy.contains('Create Epoch', { timeout: 45000 }).click();
    cy.getInputByLabel('Duration (days)').type('1').blur();
    cy.contains('Save').click();
    cy.contains('starts in 23 hr', { timeout: 120000 });
  });
});
