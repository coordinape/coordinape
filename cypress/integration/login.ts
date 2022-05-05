import { injectWeb3 } from '../util';

context('Coordinape', () => {
  before(() => {
    Cypress.on('window:before:load', injectWeb3);
  });
  it('can login', () => {
    cy.visit('/');
    cy.login();
    // This is highly depedendent upon how our seed is constructed..
    cy.url({ timeout: 120000 }).should('include', '/allocation', {
      timeout: 120000,
    });
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
    cy.contains('Thank your teammates by allocating them GIVE', {
      timeout: 45000,
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
        cy.get('[data-testid=increment]')
          // TODO: create a multi-click custom command
          .click()
          .click()
          .click()
          .click()
          .click();
        cy.contains('Leave a Note').click().type("you're great!");
      });
    cy.get('[data-testid=profileCard]')
      .eq(2)
      .within(() => {
        cy.contains('GIVE Allocated').click().type('50');
        cy.contains('Leave a Note').click().type("you're awesome!");
      });
    cy.contains('Save Allocations').click();
    cy.contains('Saved Gifts', { timeout: 120000 });
  });
});
