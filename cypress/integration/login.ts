import { Web3Provider } from '@ethersproject/providers';

import { TestProvider } from '../util';

context('Coordinape', () => {
  before(() => {
    cy.on('window:before:load', win => {
      const provider = new Web3Provider(
        new TestProvider('http://localhost:8545')
      );
      Object.defineProperty(win, 'ethereum', { value: provider });
    });
  });
  it('can login', () => {
    cy.visit('http://localhost:3000');
    cy.get('button').click();
    cy.contains('Metamask').click();
    cy.contains('Start a Circle').click();
  });
});
