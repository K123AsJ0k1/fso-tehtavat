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

      it('A blog can be removed', function() {
        cy.contains('title author')
        cy.contains('view').click()
        cy.contains('remove').click()
        cy.contains('A blog with a title from an author author was deleted')
      })

      describe('and there are many of them', function() {
        beforeEach(function() {
          cy.contains('create new blog').click()
          cy.get('#title').type('title1')
          cy.get('#author').type('author1')
          cy.get('#url').type('url1')
          cy.get('#create-button').click().wait(1000)

          cy.contains('create new blog').click()
          cy.get('#title').type('title2')
          cy.get('#author').type('author2')
          cy.get('#url').type('url2')
          cy.get('#create-button').click().wait(1000)

          cy.contains('create new blog').click()
          cy.get('#title').type('title3')
          cy.get('#author').type('author3')
          cy.get('#url').type('url3')
          cy.get('#create-button').click().wait(1000)
        })

        it('Blogs are ordered in creation order', function() {
          cy.get('.blog').eq(0).should('contain', 'title author')
          cy.get('.blog').eq(1).should('contain', 'title1 author1')
          cy.get('.blog').eq(2).should('contain', 'title2 author2')
          cy.get('.blog').eq(3).should('contain', 'title3 author3')
        })

        it('Blogs are in most liked order', function() {
          cy.get('.blog').eq(3).contains('view').click()
          cy.get('.blog').eq(3).contains('like').click().wait(1000)
          cy.get('.blog').eq(0).contains('like').click().wait(1000)
          cy.get('.blog').eq(0).contains('like').click().wait(1000)

          cy.get('.blog').eq(3).contains('view').click()
          cy.get('.blog').eq(3).contains('like').click().wait(1000)
          cy.get('.blog').eq(1).contains('like').click().wait(1000)

          cy.get('.blog').eq(3).contains('view').click()
          cy.get('.blog').eq(3).contains('like').click().wait(1000)

          cy.get('.blog').eq(0).should('contain', 'title3 author3')
          cy.get('.blog').eq(1).should('contain', 'title2 author2')
          cy.get('.blog').eq(2).should('contain', 'title1 author1')
          cy.get('.blog').eq(3).should('contain', 'title author')
        })
      })
    })
  })


})