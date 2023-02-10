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
  it('can create a nominee', () => {
    cy.visit(`/circles/${circleId}/members`);
    cy.login();

    cy.contains('Nominate Member', { timeout: 120000 }).click();
    // enter the nominee creation modal and fill it out
    cy.get('[name=name]').click().type('Satoshi');
    cy.get('[name=address]')
      .click()
      .wait(1000)
      .type('0x51508887C3FEf0b4390091C5A4B2B91562881526');
    cy.contains('Why are you nominating')
      .click()
      .wait(1000)
      .type("It's annoying that I need to fill forty whole characters here.");
    cy.get('button').contains('Nominate Member').click();
    cy.contains('You have successfully nominated Satoshi', {
      timeout: 120000,
    }).should('be.visible');
    cy.contains('Satoshi').click();
    cy.visit(`/circles/${circleId}/members`);
    cy.contains('Satoshi', { timeout: 120000 });
    //cy.contains('GQL Query Error', { timeout: 45000 }).should('not.exist');
  });
});
