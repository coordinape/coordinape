import { gqlQuery, injectWeb3 } from '../util';

let circleId, circleName;

context('Coordinape', () => {
  before(() => {
    Cypress.on('window:before:load', injectWeb3());
    return gqlQuery({
      circles: [
        {
          where: { organization: { name: { _eq: 'Ended Epoch With Gifts' } } },
        },
        { id: true, name: true },
      ],
    }).then(q => {
      circleId = q.circles[0].id;
      circleName = q.circles[0].name;
    });
  });
  it('can create new epoch after changing parameters', () => {
    cy.visit(`/circles/${circleId}/epochs`);
    cy.login();

    cy.contains(circleName);
    cy.contains('There are no scheduled epochs');
    cy.contains('Create Epoch', { timeout: 45000 }).click();
    // traverse the div representing the radio component
    // to get to the radio button
    cy.contains('Does Not Repeat', { timeout: 45000 })
      .siblings()
      .first()
      .click();
    cy.contains('Save').click();
    cy.contains('starts in 23 hr');
    cy.contains('Delete Epoch').click();
    cy.contains('button', 'Remove').click();
    cy.contains('There are no scheduled epochs', { timeout: 12000 });
  });
});
