describe('robot shop order product', function () {
    before(() => {
        // start recording
        cy.recordHar();
    });

    after(() => {
        // HAR will be saved as users.spec.har 
        // at the root of the project 
        cy.saveHar();
    });

    it('Visit Robotshop', function () {
        cy.visit('http://ec2-52-57-166-83.eu-central-1.compute.amazonaws.com:8080/')
    })

    it('Login', function () {
        cy.get('.ng-scope > .row > .nav > h3:nth-child(1) > a').click()
        cy.get('.credentials:nth-child(1) > tbody > tr:nth-child(1) > td > .ng-pristine').click()
        cy.get(':nth-child(1) > tbody > :nth-child(1) > :nth-child(2) > .ng-pristine').type('demo')
        cy.get(':nth-child(1) > tbody > :nth-child(2) > :nth-child(2) > .ng-pristine').type('demo')
        cy.get('.credentials:nth-child(1) > tbody > tr > .centre > button').click()
    })
    it('Search', function () {
        cy.get('.ng-scope > .ng-scope > #search > .ng-pristine > .ng-pristine').click()
        cy.get('.ng-scope > .ng-scope > #search > .ng-valid > .ng-untouched').type('robot')
        cy.get('.ng-scope > .ng-scope > #search > .ng-valid > button').click()
    })
    it('Select product', function () {
        cy.server()
        cy.route('GET', '/api/ratings/api/fetch/**').as('ratings')

        cy.get('table > tbody > .ng-scope:nth-child(1) > td > .product').click()
        cy.wait('@ratings').then(function (xhr) {
            cy.log(xhr.responseBody)
        })

        cy.get('.ng-scope > .ng-scope > .productcart > .ng-scope > button').click()
    })
    it('Checkout', function () {
        cy.get('.ng-scope > .row > .nav > h3:nth-child(2) > a').click()

        cy.contains('Checkout').click()
        cy.get('.main > .ng-scope > .ng-scope > div:nth-child(2) > .ng-pristine').select('dk')
        cy.get('.main > .ng-scope > .ng-scope > div > #location').click()
        cy.get('.main > .ng-scope > .ng-scope > div > #location').type('Copenhagen')
        cy.get('.autocomplete-suggestions').click()
    })
    it('Confirm and Pay', function () {
        cy.get('.main > .ng-scope > .ng-scope > div > button').click()
        cy.get('.ng-scope > .ng-scope > .ng-scope > div > button').click()
        cy.get('table > tbody > tr > td > button').click()
    })

})
