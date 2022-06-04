/* eslint-disable no-undef */
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
//const blog = require('../models/blog')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  for (let blog of initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('correct amount of blogs is returned', async () => {
  const res = await api.get('/api/blogs')
  expect(res.body).toHaveLength(initialBlogs.length)
})

test('the indentification of returned blogs is defined as id', async () => {
  const res = await api.get('/api/blogs')
  expect(res.body[0].id).toBeDefined()
})

test('a valid blog can be added', async () => {
  const test_blog = {
    title: 'Title',
    author: 'Author',
    url: 'Url',
    likes: 0
  }

  await api.post('/api/blogs')
    .send(test_blog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const res = await api.get('/api/blogs')
  const titles = res.body.map(blog => blog.title)
  const authors = res.body.map(blog => blog.author)
  const urls = res.body.map(blog => blog.url)

  expect(res.body).toHaveLength(initialBlogs.length + 1)
  expect(titles).toContain(test_blog.title)
  expect(authors).toContain(test_blog.author)
  expect(urls).toContain(test_blog.url)
})

test('null likes is 0', async () => {
  const null_blog = {
    title: 'Null_like',
    author: 'Null_like',
    url: 'Null_like',
    likes: null
  }
  await api.post('/api/blogs').send(null_blog)
  const res = await api.get('/api/blogs')
  const likes = res.body.map(blog => blog.likes)
  expect(likes[res.body.length-1]).toBe(0)
})

afterAll(() => {
  mongoose.connection.close()
})