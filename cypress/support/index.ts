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
    }
  }
}
