
describe("TicketMonster Order Tickets", () => {
  global.booking = {}

  before(() => {
    // start recording
    cy.recordHar();
  });

  after(() => {
    // HAR will be saved as users.spec.har 
    // at the root of the project 
    cy.saveHar();
  });

  describe('Ticketmonster homepage', () => {
    it('Start homepage and validate the title', function () {
      cy.visit('/ticket-monster')
        .get('title')
        .should('contain', 'Ticket Monster')
    })
    it('Check Apica logo is visible', function () {
      cy.get('.visible-md-block').should('be.visible')
    })
  })

  describe('Get events', () => {
    it('Click events link and select random category. Click first event', function () {

      cy.contains("Events").click()
      cy.get('#itemMenu').as("itemMenu").should('be.visible')
      cy.get('@itemMenu').get('.panel-default').as("categories").should('have.length.least', 1)
      cy.screenshot()
      cy.get('@categories').then(($category) => {
        let idx = Math.floor(Math.random() * $category.length);
        let cat = $category.eq(idx)
        let div_event = `#category-${idx + 1}`
        cy.get(cat).first().should('have.length', 1).click()
        cy.get(div_event).first().click()
      })
    })
  })

  describe('Select an event', () => {
    it('Check for Where and What controls', function () {
      cy.contains("What")
      cy.contains("Where")
      cy.screenshot()
    })
    it('Select venue', function () {
      cy.contains("Where").get("#venueSelector").as("venueSelector")
      cy.setRandomOption("@venueSelector", '[value="0"]')
    })

    it('Order tickets', function () {
      cy.contains("When").as("when")
      cy.get("@when").get("#dayPicker").as("dayPicker")
      cy.setRandomOption("@dayPicker")
      cy.get("@when").get("#performanceTimes").as("performanceTimes")
      cy.setRandomOption("@performanceTimes")
      cy.screenshot()
      cy.get("@when").get('input[name="bookButton"]').click()
    })
  })

  describe('Checkout selected tickets', () => {
    beforeEach(() => {
      cy.fixture('users.json').as('users');
      cy.server()
    })
    it('Select tickets', function () {
      cy.get('#sectionSelectorPlaceholder').as("sectionSelector")
      cy.setRandomOption("@sectionSelector", '[value="-1"]')
      cy.get("@sectionSelector").get('input[name="tickets-1"]').type("2")
      cy.get("@sectionSelector").get('input[name="add"]').click()
    })

    it('Enter email and click checkout button ', function () {
      cy.fixture('users.json').as('usersJson')
      cy.get('#request-summary').as("summary")

      cy.get("@summary").get('#email').type(this.users.email)
      cy.route('POST', '/ticket-monster/rest/bookings').as('booking')
      cy.get("@summary").get('input[name="submit"]').click()
      cy.wait('@booking').then(function (xhr) {
        global.booking = xhr.responseBody
        cy.log(`new booking id: ls${global.booking.id}`)
      })
      cy.screenshot()
    })
  })
  describe('Validate new booking and delete it', () => {
    it('delete the booking', function () {
      cy.request('DELETE', `ticket-monster/rest/bookings/${global.booking.id}`).then((resp) => {
        expect(resp.status).to.eq(204)
        cy.log(`Booking ${global.booking.id} deleteds`)
      })
    })
  })
})
