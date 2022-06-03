import { injectWeb3 } from '../util';

context('Coordinape', () => {
    before(() => {
        const providerPort = Cypress.env('HARDHAT_GANACHE_PORT');
        Cypress.on('window:before:load', injectWeb3(providerPort));
    });

    it("can create a new user with fixed payment amount", () => {
        cy.visit('/circles');
        cy.login();
        // This is highly dependent upon how our seed is constructed..
        cy.url({ timeout: 120000 }).should('include', '/circles');
        cy.contains('Toys', { timeout: 120000 })
            .parent()
            .parent()
            .within(() => {
                cy.get('.hover-buttons').invoke('show');
                cy.get('a').contains('Admin').click();
            });
        cy.url({ timeout: 120000 }).should('include', '/admin');
        cy.contains("Add Contributor",{ timeout: 120000 }).should("be.visible");
        cy.contains('Add Contributor').click();
        cy.contains('Contributor Name').parent().within(() => {
            cy.get('input').type('A Test User').blur();
        });
        cy.contains('Contributor ETH address').parent().within(() => {
            cy.get('input').type('0xe00b84525b71ef52014e59f633c97530cb278e09').blur();
        });
        // enter the fixed payment amount
        cy.contains('Create User').parent().within(() => {
            cy.contains('Fixed Payment Amount').parent().within(() => {
                // there seem to be a default 0 in a number input so we add one less 0
                cy.get('input').clear().type('1200').blur();
            })
        })

        cy.contains('Save').click();
        cy.reload(true);
        cy.contains("A Test User",{ timeout: 120000 }).should("be.visible");
        // Verify new value in contributors table
        cy.contains('A Test User', { timeout: 120000 })
            .parents('tr')
            .within(() => {
                cy.get('td').eq(7).should('have.text', '12000');
        })
    });
});
