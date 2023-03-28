import faker from 'faker';

import { gqlQuery, injectWeb3 } from '../util';

let circleId;

context('Coordinape', () => {
  before(() => {
    Cypress.on('window:before:load', injectWeb3());
    return gqlQuery(
      {
        circles: [
          {
            where: {
              organization: { name: { _eq: 'Fresh Open Epoch Admin' } },
            },
          },
          { id: true },
        ],
      },
      { operationName: 'cypress' }
    ).then(q => {
      circleId = q.circles[0].id;
    });
  });

  // TODO change more settings besides fixed payment token
  it('can update circle settings', () => {
    cy.visit(`/circles/${circleId}/admin`);
    cy.login();
    cy.get('.contentHeader').invoke('css', 'position', 'static');

    const tokenName = faker.system.commonFileExt().toUpperCase();

    cy.getInputByLabel('Token name for CSV export')
      .clear()
      .type(tokenName)
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
    cy.getInputByLabel('Token name for CSV export').should(
      'have.value',
      tokenName
    );
  });
});
