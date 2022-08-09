describe('URL Shortener', () => {
  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:3001/api/v1/urls', {fixture: "urlData"})
    cy.visit('http://localhost:3000/')
  })
  it('Should allow a user to view the page title and the existing shortened URLs', () => {
    cy.get('h1').should('contain.text', 'URL Shortener')
    cy.get('.url').should('have.length', '2')

    cy.get('h3').first().should('contain.text', 'Awesome photo')
    cy.get('h3').last().should('contain.text', 'Whale')

    cy.get('a').first().should('contain.text', 'http://localhost:3001/useshorturl/1')
    cy.get('a').last().should('contain.text', 'http://localhost:3001/useshorturl/3')

    cy.get('p').first().should('contain.text', 'https://images.unsplash.com/photo-1531898418865-480b7090470f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80')
    cy.get('p').last().should('contain.text', 'https://www.istockphoto.com/photo/humpback-whale-playfully-swimming-in-clear-blue-ocean-gm1301667498-393646692?utm_source=unsplash&utm_medium=affiliate&utm_campaign=category_photos_top&utm_content=https%3A%2F%2Funsplash.com%2Fimages%2Fanimals%2Fwhale&utm_term=whale%3A%3A%3A')
  })

  it('Should allow a user to view the Form with the proper inputs', () => {
    cy.get('input[name="title"]').should('be.visible')
    cy.get('input[name="title"]').type('Peach')

    cy.get('input[name="long_url"]').should('be.visible')
    cy.get('input[name="long_url"]').type('https://depositphotos.com/stock-photos/peach-fruit.html')

    cy.get('button').should('be.visible')
    cy.get('button').should('contain.text', 'Shorten Please!')
  })

  it('Should allow the user information to be reflected in the input fields', () => {
    cy.get('input[name="title"]').type('Peach')
    cy.get('input[name="title"]').should('have.value', 'Peach')
    cy.get('input[name="long_url"]').type('https://depositphotos.com/stock-photos/peach-fruit.html')
    cy.get('input[name="long_url"]').should('have.value', 'https://depositphotos.com/stock-photos/peach-fruit.html')
  })

  it('Should allow a user to submit a new URL and have the shortened version render on the DOM', () => {
    cy.intercept('POST', 'http://localhost:3001/api/v1/urls', {
      statusCode: 201,
      body: {
        id: 2,
        title: 'Peach', 
        long_url: 'https://depositphotos.com/stock-photos/peach-fruit.html',
        short_url: "http://localhost:3001/useshorturl/2"
      }
    })
    cy.get('button').click()

    cy.get('.url').should('have.length', '3')
    cy.get('h3').last().should('contain.text', 'Peach')
    cy.get('a').last().should('contain.text', 'http://localhost:3001/useshorturl/2')
    cy.get('p').last().should('contain.text', 'https://depositphotos.com/stock-photos/peach-fruit.html')
  })

  it('Should let the user know if the server responds with a failed request', () => {
    cy.intercept('http://localhost:3001/api/v1/urls', {forcedNetworkError: true})
    cy.intercept('http://localhost:3001/api/v1/urls', {
      statusCode: 400
    })
    cy.visit('http://localhost:3000/')
    cy.get('.error').should('contain.text', 'Whoops, there\'s been an error')
  })

  it('Should let the user know if the server responds with a 500 error', () => {
    cy.intercept('http://localhost:3001/api/v1/urls', {forcedNetworkError: true})
    cy.intercept('http://localhost:3001/api/v1/urls', {
      statusCode: 500
    })
    cy.visit('http://localhost:3000/')
    cy.get('.error').should('contain.text', 'Whoops, there\'s been an error')
  })
})