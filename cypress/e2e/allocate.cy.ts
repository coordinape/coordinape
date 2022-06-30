import { injectWeb3 } from '../util';

context('Coordinape', () => {
  before(() => {
    const providerPort = Cypress.env('HARDHAT_GANACHE_PORT');
    Cypress.on('window:before:load', injectWeb3(providerPort));
  });
  it('can login', () => {
    cy.visit('/');
    cy.login();
    cy.contains('Movies', { timeout: 120000 })
      .parent()
      .parent()
      .within(() => {
        cy.get('.hover-buttons').invoke('show');
        cy.get('a').contains('Allocation').click();
      });
    cy.url({ timeout: 120000 }).should('include', '/epoch');
    cy.contains('What have you been working on').click();
  });
  it('can opt In', () => {
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
    // can be used to work on this test directly without waiting for other
    // tests on each run
    //cy.visit('/give');
    //cy.login();
    cy.get('[data-testid=profileCard]')
      .eq(1)
      .within(() => {
        cy.get('[data-testid=increment]').multiClick(5).wait(10000);
        // there's some recoil funny business happening where old
        // textbox state is restored if typing starts too quickly after
        // incrementing tokens. This delay prevents an application error
        // Not sure if it's worth fixing... since
        // we're not doing too much with recoil anymore
        cy.contains('Leave a Note')
          .click()
          .type("{selectAll}you're great!", { delay: 10 });
      });
    cy.get('[data-testid=profileCard]')
      .eq(2)
      .within(() => {
        cy.contains('GIVE Allocated').click().type('{selectAll}50');
        cy.contains('Leave a Note')
          .click()
          .type("{selectAll}you're awesome!", { delay: 10 });
      });
    cy.contains('Save Allocations').click();
    cy.contains('Saved Gifts', { timeout: 120000 });
  });
});
