describe('This file contains all tests related to edit a question through the edit dialog for each question', () => {
    beforeEach(() => {
        cy.visit("/")
    });
    it('How a user would cancel the edit dialog after opening it for a date question', () => {
        cy.cancelEditDialog('date');
    });
    it('This test shows how a user would edit the title of a date question', () => {
        cy.editTitle('date');
    });
    it('This test shows how a user would toggle the visibility of a date question to be hidden', () => {
        cy.hideQuestion('date');
    });
    it('How a user would double tap on a title of a date question to make a change from the current title', () => {
        cy.doubleQuestionClickToEditTitle('date');
    });
    it('How a user would double tap on a title of a date question without making a change to the title', () => {
        cy.doubleQuestionClickToEditTitleWithoutChange('date');
    });
    it('How a user would select this type of question to set section end as true ', () => {
        cy.enableSectionEnd('date');
    });
    it('How a user would select this type of question to set required question end as true ', () => {
        cy.enableRequiredProperty('date');
    });
    it('How a user would set the text of a certain tooltip for a specific question', () => {
        cy.enableToolTipText('date');
    });
    it('How a user would set a label for a dropdown question', () => {
        const placeholder = 'pla';
        const fullplaceholderProperty = `"${label}":`;
        cy.get('#jsonText').contains(`${fullLabelProperty}"${label}"`).should('not.exist');
        cy.dragFromSidebar('dropdown');
        cy.openEditDialog();
        cy.get('[data-cy=label]').click().type(label);
        cy.get('[data-cy=submit1]')
            .click();
        cy.get('#jsonText').contains(`${fullLabelProperty}"${label}"`)
    });
});

