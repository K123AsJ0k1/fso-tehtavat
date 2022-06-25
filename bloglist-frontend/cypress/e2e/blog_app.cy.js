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

  describe('When logged in', function() {
    beforeEach(function() {
      cy.get('#username').type('testUser')
      cy.get('#password').type('testUser')
      cy.get('#login-button').click()
    })

    it('A blog can be created', function() {
      cy.contains('blogs')
      cy.contains('create new blog').click()
      cy.contains('create new')
      cy.get('#title').type('title')
      cy.get('#author').type('author')
      cy.get('#url').type('url')
      cy.get('#create-button').click()
      cy.contains('title author')
    })

    describe('and a blog exists', function() {
      beforeEach(function() {
        cy.contains('create new blog').click()
        cy.get('#title').type('title')
        cy.get('#author').type('author')
        cy.get('#url').type('url')
        cy.get('#create-button').click()
      })

      it('A blog can be liked', function() {
        cy.contains('title author')
        cy.contains('view').click()
        cy.contains('likes 0')
        cy.contains('like').click()
        cy.contains('likes 1')
      })
    })
  })


})