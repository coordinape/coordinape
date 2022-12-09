import { gqlQuery, injectWeb3 } from '../util';

let circleId;

context('Coordinape', () => {
  before(() => {
    Cypress.on('window:before:load', injectWeb3());
    return gqlQuery({
      circles: [
        {
          where: {
            organization: {
              name: { _eq: 'Fresh Open Epoch Admin With Fixed Payment Token' },
            },
          },
        },
        { id: true },
      ],
    }).then(q => {
      circleId = q.circles[0].id;
    });
  });
  it("can update user's fixed payment", () => {
    const oldAddress = '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc';

    cy.visit(`/circles/${circleId}/members`);
    cy.login().wait(5000);

    // Assert that the old address is there and correct
    assertAddr(oldAddress);

    // Click on edit user
    cy.contains('Kasey', { timeout: 120000 })
      .parents('tr')
      .within(() => {
        cy.get('td').last().get('button:first').click();
      });

    // enter the fixed payment amount
    cy.getInputByLabel('Member Fixed Payment').clear().type('1200').blur();

    cy.contains('Save').click().wait(5000);
    // Verify new value in contributors table
    cy.contains('Kasey', { timeout: 120000 })
      .parents('tr')
      .within(() => {
        cy.get('td').eq(4).should('have.text', '1200 DAI');
      });
  });
});

const assertAddr = (addr: string) => {
  cy.contains('Kasey', { timeout: 120000 })
    .parents('tr')
    .within(() => {
      cy.get('td').eq(1).contains(addr.substr(0, 5), { timeout: 45000 });
    });
};
