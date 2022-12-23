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
  it('can select teammates', () => {
    cy.contains('Bruce')
      .parents('[data-testid=give-row]')
      .trigger('mouseover')
      .within(() => {
        cy.get('[data-testid=collaborator-button]').within(() => {
          cy.get('span').eq(0).should('not.have.class', 'teammate');
        });
        cy.get('[data-testid=collaborator-button]').click().wait(2000);
        cy.get('[data-testid=collaborator-button]').within(() => {
          cy.get('span').eq(0).should('have.class', 'teammate');
        });
      });
  });
  it('can allocate to teammates', () => {
    cy.contains('Bruce')
      .parents('[data-testid=give-row]')
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

    cy.contains('Bruce')
      .parents('[data-testid=give-row]')
      .within(() => {
        cy.contains('Note Complete').wait(1000);
      });

    cy.contains('Kasey')
      .parents('[data-testid=give-row]')
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

    cy.contains('Kasey')
      .parents('[data-testid=give-row]')
      .within(() => {
        cy.contains('Note Complete').wait(1000);
      });
  });
});
