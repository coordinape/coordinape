import { gqlQuery, injectWeb3, deriveAccount } from '../util';

let circleId;

context('Coordinape', () => {
  before(() => {
    const providerPort = Cypress.env('HARDHAT_GANACHE_PORT');
    const userAccount = deriveAccount().address;
    Cypress.on('window:before:load', injectWeb3(providerPort));
    return cy
      .mintErc20('USDC', userAccount, '20000')
      .then(() =>
        gqlQuery({
          circles: [{ where: { name: { _eq: 'Sports' } } }, { id: true }],
        })
      )
      .then(q => {
        circleId = q.circles[0].id;
      });
  });
  after(() => {
    // might want something more surgical and lightweight
    // to facilitate faster idempotent testing
    // cy.exec('yarn db-seed-fresh');
  });
  it('can deploy a vault and create a distribution', () => {
    cy.visit('/vaults');
    cy.login();
    cy.contains('Ended Epoch With Gifts', { timeout: 120000 }).click();
    cy.wait(1000);
    cy.contains('Add coVault').click();
    cy.get('[role=dialog]').contains('USDC').click();
    cy.contains('Create coVault').click();
    cy.contains('USDC coVault', { timeout: 120000 });

    // Deposit USDC into the vault
    cy.contains('Deposit').click();
    cy.get('input[type=number]').click().wait(1000).type('5000');
    cy.contains('button', 'Deposit USDC').click();
    cy.contains('Transaction completed');
    cy.contains('5000 USDC');

    // Withdraw USDC from the Vault
    cy.contains('Withdraw').click();
    cy.get('input[type=number]').click().wait(1000).type('100');
    cy.contains('button', 'Withdraw USDC').click();
    cy.contains('Transaction completed');
    cy.contains('4900 USDC');

    // submit distribution onchain
    cy.visit(`/circles/${circleId}/members`);
    cy.contains('a', 'Distributions', { timeout: 120000 }).click();
    cy.get('input[type=number]').click().type('4500').wait(10000);
    cy.contains('button', 'Submit Distribution').click();
    cy.contains('Submitting', { timeout: 120000 });
    cy.contains('Please sign the transaction', { timeout: 120000 });
    cy.contains('Transaction completed', { timeout: 120000 });
    cy.contains('Distribution saved successfully', { timeout: 120000 });
    // This takes extremely long time to render in the UI without a refresh
    cy.reload(true);
    cy.contains('Distribution submitted today', { timeout: 120000 });

    // claims allocations
    cy.contains('button', 'Claim Allocations').click();
    cy.contains('button', 'Claim USDC').click();
    cy.contains('Please sign the transaction', { timeout: 120000 });
    cy.contains('Claim of allocations successful', { timeout: 120000 });
  });
});
