Cypress.Commands.add('setRandomOption', (dropdown, filter = '[value="<<???>>"]') => {
    cy.get(dropdown).find('option').not(filter)
        .then(($options) => {
            let idx = Math.floor(Math.random() * $options.length);
            $options.get(idx).setAttribute('selected', "selected")

        })
        .parent().trigger("change")
})
 