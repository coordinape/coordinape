// load type definitions that come with Cypress module
/// <reference types="cypress" />

// ***********************************************
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
Cypress.Commands.add('login', () => {
  cy.contains('Connect your wallet').click();
  cy.contains('Metamask').click();
});
