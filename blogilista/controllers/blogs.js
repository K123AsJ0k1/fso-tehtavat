const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  if (!isNaN(blog.likes)) {
    blog.likes = 0
  }
  const savedBlog = await blog.save()
  response.json(savedBlog)
})

module.exports = blogsRouter