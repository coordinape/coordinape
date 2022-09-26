import { gqlQuery, injectWeb3 } from '../util';

let circleId;

context('Coordinape', () => {
  before(() => {
    const providerPort = Cypress.env('HARDHAT_GANACHE_PORT');
    Cypress.on('window:before:load', injectWeb3(providerPort));
    return gqlQuery({
      circles: [{ where: { name: { _eq: 'Movies' } } }, { id: true }],
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
      .wait(10000)
      .type('0x51508887C3FEf0b4390091C5A4B2B91562881526');
    cy.contains('Why are you nominating')
      .click()
      .type("It's annoying that I need to fill forty whole characters here.");
    cy.get('button').contains('Nominate Member').click();
    cy.contains('You have successfully Nominated Satoshi', {
      timeout: 120000,
    }).should('be.visible');
    cy.get('button').contains('Back').click().wait(5000);
    cy.contains('Satoshi').click();
    cy.contains('Vouch for Satoshi', { timeout: 120000 });
    //cy.contains('GQL Query Error', { timeout: 45000 }).should('not.exist');
  });
});
