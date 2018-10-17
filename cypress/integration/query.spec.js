it('loads', () => {
  cy.visit('./geodata-sources/')
})

describe('Searching', function() {
  it('filters on search terms', () => {
    cy.visit('./geodata-sources/')

    cy.get('input[name="query"]').type('osm')
    cy.contains('OpenStreetMap')
    cy.should('not.contain', 'Getty')

    cy.get('input[name="query"]').clear()

    cy.get('input[name="query"]').type('getty')
    cy.contains('Getty Thesaurus')
    cy.should('not.contain', 'OpenStreetMap')
  })

  it('filters on leading substring', () => {
    cy.visit('./geodata-sources/')

    cy.get('input[name="query"]').type('chin')
    cy.contains('China')
  })

  it('filters out negated terms', () => {
    cy.visit('./geodata-sources/')

    cy.get('input[name="query"]').type('chin')
    cy.contains('China')
    cy.get('ul#documents li').then($el => {
      const lengthBefore = $el.length

      // assumes that one of the "China" results also contains "Japan", true IRL...
      cy.get('input[name="query"]').type('{selectall}{rightarrow} -japa')
      cy.get('ul#documents li').then($el => {
        const lengthAfter = $el.length
        expect(lengthAfter).to.be.lessThan(lengthBefore)
      })
    })
  })
})
