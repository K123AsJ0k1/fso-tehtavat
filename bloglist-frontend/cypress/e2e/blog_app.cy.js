//const { func } = require("prop-types")

describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'testUser',
      username: 'testUser',
      password: 'testUser'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('log in to application')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('testUser')
      cy.get('#password').type('testUser')
      cy.get('#login-button').click()
      cy.contains('testUser logged in')
    })
    it('fails with wrong credentials', function() {
      cy.get('#username').type('testUser')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()
      cy.contains('wrong username or password')
    })
  })

})