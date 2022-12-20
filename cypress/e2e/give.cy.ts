import { gqlQuery, injectWeb3 } from '../util';

let circleId;

context('Coordinape', () => {
  before(() => {
    Cypress.on('window:before:load', injectWeb3());
    return gqlQuery({
      circles: [
        {
          where: { organization: { name: { _eq: 'Fresh Open Epoch Admin' } } },
        },
        { id: true },
      ],
    }).then(q => {
      circleId = q.circles[0].id;
    });
  });
  it('can login and visit give', () => {
    cy.visit(`/circles/${circleId}/give`);
    cy.login();
    cy.url({ timeout: 120000 }).should('include', '/give');
    cy.contains('thank your teammates').click();
  });
  // it('can select teammates', () => {
  //   cy.get('[data-testid=eligibleTeammates]').within(() => {
  //     cy.get('button').first().click();
  //     cy.get('button').last().click();
  //   });
  //   cy.contains('Save Teammate List').click();
  //   cy.contains('Thank your teammates by allocating', {
  //     timeout: 90000,
  //   });
  // });
  it('can allocate to teammates', () => {
    cy.get('[data-testid=give-row]')
      .eq(2)
      .within(() => {
        cy.get('[data-testid=increment]').multiClick(5);
        cy.contains('Empty Note').click().wait(1000);
        cy.get('[data-testid=tokenCount]').should('have.value', '5');
      });

    cy.get('[data-testid=note]')
      .click()
      .wait(1000)
      .type("{selectAll}you're great!", { delay: 10 })
      .wait(1000)
      .type('{esc}');

    cy.get('[data-testid=give-row]')
      .eq(2)
      .within(() => {
        cy.contains('Note Complete').wait(1000);
      });

    cy.get('[data-testid=give-row]')
      .eq(5)
      .within(() => {
        cy.get('[data-testid=tokenCount]')
          .click()
          .wait(1000)
          .type('{selectAll}50');
        cy.contains('Empty Note').click().wait(1000);
      });

    cy.get('[data-testid=note]')
      .click()
      .wait(1000)
      .type("{selectAll}you're great!", { delay: 10 })
      .wait(1000)
      .type('{esc}');

    cy.get('[data-testid=give-row]')
      .eq(5)
      .within(() => {
        cy.contains('Note Complete').wait(1000);
      });
  });
});
