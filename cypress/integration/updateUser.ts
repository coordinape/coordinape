import { injectWeb3 } from '../util';

context('Coordinape', () => {
  before(() => {
    const providerPort = Cypress.env('HARDHAT_GANACHE_PORT');
    Cypress.on('window:before:load', injectWeb3(providerPort));
  });
  it("can update user's address and restore it to previous value", () => {
    const oldAddress = '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc';
    const newAddress =
      '0x51508887c3fef0b4390091c5a4b2b91562881526'.toLowerCase();

    cy.visit('/circles');
    cy.login();
    // This is highly dependent upon how our seed is constructed..
    cy.url({ timeout: 120000 }).should('include', '/circles');
    // Sports is a circle w/ an ended epoch, the Admin button is a child of a peer element
    cy.contains('Sports', { timeout: 120000 })
      .parent()
      .parent()
      .within(() => {
        cy.get('.hover-buttons').invoke('show');
        cy.get('a').contains('Admin').click();
      });
    cy.url({ timeout: 120000 }).should('include', '/admin');

    // Assert that the old address is there and correct
    assertAddr(oldAddress);

    // Click on edit user
    cy.contains('Kasey', { timeout: 120000 })
      .parents('tr')
      .within(() => {
        cy.get('td').last().get('[d^=M4]').click(); // This selects the pencil SVG
      });

    // enter the new address
    cy.get('[value=' + oldAddress + ']')
      .clear()
      .click()
      .type(newAddress);

    cy.contains('Save').click();

    // Assert that the new address is there and correct now
    assertAddr(newAddress);

    // RESTORE THE OLD ADDRESS FOR IDEMPOTENCE

    // Click on edit user
    cy.contains('Kasey', { timeout: 120000 })
      .parents('tr')
      .within(() => {
        cy.get('td').last().get('[d^=M4]').click(); // This selects the pencil SVG
      });

    // enter the old address
    cy.get('[value=' + newAddress + ']')
      .clear()
      .click()
      .type(oldAddress);

    cy.contains('Save').click();

    // Assert that the old address is there and correct
    assertAddr(oldAddress);
  });
});

const assertAddr = (addr: string) => {
  cy.contains('Kasey', { timeout: 120000 })
    .parents('tr')
    .within(() => {
      cy.get('td').eq(1).contains(addr.substr(0, 6), { timeout: 45000 });
    });
};
