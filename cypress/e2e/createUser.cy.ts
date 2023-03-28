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

  after(() => {
    // might want something more surgical and lightweight
    // to facilitate faster idempotent testing
    // cy.exec('yarn db-seed-fresh');
  });
  it('can create a new user with fixed payment amount', () => {
    cy.visit(`/circles/${circleId}/members`);
    cy.login();

    cy.contains('Add Members').should('be.visible');
    cy.contains('Add Members').click();

    cy.contains('ETH Address').should('be.visible');
    cy.contains('ETH Address').click();

    const newUserName = `A Test User ${faker.datatype.number(10000)}`;
    const newAddress = faker.finance.ethereumAddress();

    cy.get('[data-testid=new-members]').within(() => {
      cy.get('input').eq(0).click().type(newUserName);
      cy.get('input').eq(1).click().type(newAddress);
    });

    cy.get('button').contains('Add Members').should('be.enabled');
    cy.get('button').contains('Add Members').click();
    cy.contains('You have added 1 member!').should('be.visible');
    cy.get('a').contains('Members').click();
    cy.contains(newUserName).should('be.visible');
  });
});
