/// <reference types="cypress" />
// ***********************************************************
// https://on.cypress.io/configuration
// ***********************************************************

import './commands';
import 'dd-trace/ci/cypress/support';

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

      /**
       * Custom command to mint ERC20 tokens to an arbitrary address
       * on the test ganache chain
       */
      mintErc20(
        symbol: 'USDC' | 'DAI',
        receiver: string,
        amount: string
      ): Chainable;

      getInputByLabel(label: string, options?: { timeout: number }): Chainable;
    }
  }
}
