// load type definitions that come with Cypress module
/// <reference types="cypress" />

// ***********************************************
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
import { mintToken } from '../../src/utils/testing/mint';
Cypress.Commands.add('login', () => {
  cy.contains('Connect your wallet').click();
  cy.contains('Metamask').click();
});

// Cypress doesn't allow top-level callbacks to be async
// so we need to wrap anything we're waiting on into
// Cypress' async context
Cypress.Commands.add('mintErc20', (...args) => {
  cy.then(async () => {
    await mintToken(...args);
  });
});

Cypress.Commands.add('multiClick', { prevSubject: true }, multiClick);

function multiClick(subject, count: number) {
  if (count <= 0) return subject;
  Cypress.log({
    $el: subject,
    name: `click`,
    message: '',
  });
  return multiClick(subject.click(), count - 1);
}
