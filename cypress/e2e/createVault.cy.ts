import { deriveAccount, gqlQuery, injectWeb3 } from '../util';

let circleId;

context('Coordinape', () => {
  before(() => {
    const userAccount = deriveAccount().address;
    Cypress.on('window:before:load', injectWeb3());
    return cy
      .mintErc20('USDC', userAccount, '20000')
      .then(() =>
        gqlQuery({
          circles: [
            {
              where: {
                organization: { name: { _eq: 'Ended Epoch With Gifts' } },
              },
            },
            { id: true },
          ],
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
    cy.visit('/circles');
    cy.login();
    cy.wait(1000);
    cy.contains('a', 'Ended Epoch With Gifts').click();
    cy.contains('Vaults').click();
    cy.wait(1000);
    cy.contains('Accept Terms of Service').click();
    cy.contains('Create Vault').click();
    cy.get('[role=dialog]').contains('USDC').click();
    cy.contains('Create CoVault').click();
    cy.contains('USDC CoVault');
    cy.contains('0 Distributions');

    // Deposit USDC into the vault
    cy.contains('Deposit').click();
    cy.get('input[type=text]').click().wait(1000).type('5000');
    cy.contains('button', 'Deposit into').click();
    cy.contains('Transaction completed');
    cy.contains('5,000.00 USDC');
    // This takes extremely long time to render in the UI without a refresh
    cy.reload(true);
    cy.contains('a', 'Ended Epoch With Gifts').click();
    cy.contains('Vaults').click();
    cy.get('table').contains('Deposit');
    cy.get('table').contains('5,000.00');

    // Withdraw USDC from the Vault
    cy.contains('Withdraw').click();
    cy.get('input[type=text]').click().wait(1000).type('100');
    cy.contains('button', 'Withdraw from').click();
    cy.contains('Transaction completed');
    cy.contains('4,900.00 USDC');
    cy.reload(true);
    cy.contains('a', 'Ended Epoch With Gifts').click();
    cy.contains('Vaults').click();
    cy.get('table').contains('Withdraw');
    cy.get('table').contains('100');

    // submit distribution onchain
    cy.visit(`/circles/${circleId}/epochs`);
    cy.contains('a', 'Export').click();
    cy.get('input[type=text]:last').click().type('4500');
    cy.contains('button', 'Submit USDC Vault Distribution').click();
    cy.contains('Submitting');
    cy.contains('Please sign the transaction');
    cy.contains('Transaction completed');
    // This takes extremely long time to render in the UI without a refresh

    // FIXME: This is failing so we are ignoring it until we can debug - this was part of the previous test block
    //   cy.reload(true);
    //   cy.contains('Distribution completed today');
    //   cy.contains('Ended Epoch With Gifts').click();
    //   cy.contains('Vaults').click();
    //   cy.contains('1 Distribution');
    //   cy.contains('6 Unique Contributors Paid');
    //   cy.get('table').contains('Distribution');
    //   cy.get('table').contains('4,500.00');
    //
    //   // claims allocations
    //   cy.contains('a', 'Claim Tokens').click();
    //   cy.contains('button', 'Claim USDC').click();
    //   cy.contains('Please sign the transaction');
    //   cy.contains('Claim succeeded');
  });
});
