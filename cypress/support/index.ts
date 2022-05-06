/// <reference types="cypress" />
// ***********************************************************
// https://on.cypress.io/configuration
// ***********************************************************

import './commands';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to log in via the injected web3 provider
       * @example cy.login()
       */
      login(): Chainable;

      /**
       * Custom command to single-click an element an aribitrary
       * number of times
       * @example cy.multiClick(5)
       */
      multiClick(count: number): Chainable;
    }
  }
}
