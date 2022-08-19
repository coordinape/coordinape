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
    cy.contains('Create Vault').click();
    cy.get('[role=dialog]').contains('USDC').click();
    cy.contains('Create CoVault').click();
    cy.contains('USDC CoVault', { timeout: 120000 });
    cy.contains('0 Distributions');

    // Deposit USDC into the vault
    cy.contains('Deposit').click();
    cy.get('input[type=text]', { timeout: 90000 })
      .click()
      .wait(1000)
      .type('5000');
    cy.contains('button', 'Deposit into').click();
    cy.contains('Transaction completed');
    cy.contains('5000 USDC');
    // This takes extremely long time to render in the UI without a refresh
    cy.reload(true);
    cy.contains('Ended Epoch With Gifts', { timeout: 120000 }).click();
    cy.get('table').contains('Deposit');
    cy.get('table').contains('5,000.00');

    // Withdraw USDC from the Vault
    cy.contains('Withdraw').click();
    cy.get('input[type=text]', { timeout: 120000 })
      .click()
      .wait(1000)
      .type('100');
    cy.contains('button', 'Withdraw from').click();
    cy.contains('Transaction completed');
    cy.contains('4900 USDC');
    cy.reload(true);
    cy.contains('Ended Epoch With Gifts', { timeout: 120000 }).click();
    cy.get('table').contains('Withdraw');
    cy.get('table').contains('100');

    // submit distribution onchain
    cy.visit(`/circles/${circleId}/history`);
    cy.contains('a', 'Review / Export', { timeout: 120000 }).click();
    cy.get('input[type=text]:last', { timeout: 90000 }).click().type('4500');
    cy.contains('button', 'Submit Yearn USDC Vault Distribution').click();
    cy.contains('Submitting', { timeout: 120000 });
    cy.contains('Please sign the transaction', { timeout: 120000 });
    cy.contains('Transaction completed', { timeout: 120000 });
    // This takes extremely long time to render in the UI without a refresh
    cy.reload();
    cy.contains('Distribution completed today', { timeout: 120000 });
    cy.visit('/vaults');
    cy.contains('Ended Epoch With Gifts', { timeout: 120000 }).click();
    cy.contains('1 Distribution');
    cy.contains('6 Unique Contributors Paid');
    cy.get('table').contains('Distribution');
    cy.get('table').contains('4,500.00');

    // claims allocations
    cy.contains('button', 'Claim Allocations').click();
    cy.contains('button', 'Claim USDC').click();
    cy.contains('Please sign the transaction', { timeout: 120000 });
    cy.contains('Claim of allocations successful', { timeout: 120000 });
  });
});
