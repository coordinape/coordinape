import { Web3Provider } from '@ethersproject/providers';

import { TestProvider } from '../util';

context('Coordinape', () => {
  before(() => {
    cy.on('window:before:load', win => {
      const provider = new Web3Provider(
        new TestProvider('http://localhost:8546')
      );
      Object.defineProperty(win, 'ethereum', { value: provider });
    });
  });
  it('can login', () => {
    cy.log(`is CI: ${JSON.stringify(process.env)}`);
    cy.visit('http://localhost:3001');
    cy.get('button').click();
    cy.contains('Metamask').click();
    // This is highly depedendent upon how our seed is constructed..
    cy.url({ timeout: 30000 }).should('include', '/allocation', {
      timeout: 30000,
    });
    cy.contains('What have you been working on').click();
  });
});
