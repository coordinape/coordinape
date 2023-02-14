import { gqlQuery, injectWeb3 } from '../util';

let circleId;

context('Coordinape', () => {
  before(() => {
    Cypress.on('window:before:load', injectWeb3());
    return gqlQuery({
      circles: [
        {
          where: { organization: { name: { _eq: 'Fresh Open Epoch Admin' } } },
        },
        { id: true },
      ],
    }).then(q => {
      circleId = q.circles[0].id;
    });
  });

  // TODO change more settings besides fixed payment token
  it.skip('can update circle settings', () => {
    cy.visit(`/circles/${circleId}/admin`);
    cy.login();
    cy.get('.contentHeader').invoke('css', 'position', 'static');
    cy.getInputByLabel('Token name for CSV export', { timeout: 120000 })
      .clear()
      .type('DAI')
      .blur();
    cy.intercept({
      method: 'POST',
      url: '/v1/graphql',
    }).as('saveCircle');
    cy.contains('Save').click();
    cy.wait('@saveCircle', { timeout: 90000 })
      .its('response.statusCode')
      .should('equal', 200);
    cy.intercept({
      method: 'POST',
      url: '/v1/graphql',
    }).as('hardReload');
    cy.reload(true);
    cy.wait('@hardReload').its('response.statusCode').should('equal', 200);
    cy.get('.contentHeader').invoke('css', 'position', 'static');
    cy.getInputByLabel('Token name for CSV export', { timeout: 120000 }).should(
      'have.value',
      'DAI'
    );
  });
});
