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
  it('can login', () => {
    cy.visit(`/circles/${circleId}/allocation`);
    cy.login();
    cy.url({ timeout: 120000 }).should('include', '/epoch');
    cy.contains('What have you been working on').click();
  });
  it('can opt in', () => {
    cy.contains('Opt In').click();
    cy.contains('Continue With Current Settings').click();
    cy.url({ timeout: 30000 }).should('include', '/team');
  });
  it('can select teammates', () => {
    cy.get('[data-testid=eligibleTeammates]').within(() => {
      cy.get('button').first().click();
      cy.get('button').last().click();
    });
    cy.contains('Save Teammate List').click();
    cy.contains('Thank your teammates by allocating', {
      timeout: 90000,
    });
  });
  it('can allocate to teammates', () => {
    cy.get('[data-testid=profileCard]')
      .eq(1)
      .within(() => {
        cy.get('[data-testid=increment]').multiClick(5);
        // there's some recoil funny business happening where old
        // textbox state is restored if typing starts too quickly after
        // incrementing tokens. This delay prevents an application error
        // Not sure if it's worth fixing... since
        // we're not doing too much with recoil anymore
        cy.contains('Leave a Note')
          .click()
          .wait(1000)
          .type("{selectAll}you're great!", { delay: 10 });
      });
    cy.get('[data-testid=profileCard]')
      .eq(2)
      .within(() => {
        cy.contains('GIVE Allocated').click().wait(1000).type('{selectAll}50');
        cy.contains('Leave a Note')
          .click()
          .wait(1000)
          .type("{selectAll}you're awesome!", { delay: 10 });
      });
    cy.contains('Save Allocations').click();
    cy.contains('Saved Gifts', { timeout: 120000 });
  });
});
