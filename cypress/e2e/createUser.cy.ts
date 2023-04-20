import faker from 'faker';

import { createUser } from '../../api-test/helpers/users';
import { Role } from '../../src/lib/users';
import { gqlClient, injectWeb3, getMyAddress } from '../util';

let circleId;

context('Coordinape', () => {
  before(async () => {
    Cypress.on('window:before:load', injectWeb3());
    const address = getMyAddress().toLowerCase();
    const user = await createUser(gqlClient, { role: Role.ADMIN, address });
    circleId = user.circle_id;
  });

  it('can create a new user with fixed payment amount', () => {
    cy.visit(`/circles/${circleId}/members`);
    cy.login();

    cy.contains('Add Members').click();
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
    cy.get(`a[href="/circles/${circleId}/members"]`).first().click();
    cy.contains(newUserName).should('be.visible');
  });
});
