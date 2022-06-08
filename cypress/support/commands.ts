// load type definitions that come with Cypress module
/// <reference types="cypress" />

// ***********************************************
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
Cypress.Commands.add('login', () => {
  cy.contains('Metamask').click();
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
