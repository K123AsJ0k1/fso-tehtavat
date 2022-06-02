//const http = require('http')
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
//const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

// eslint-disable-next-line no-unused-vars
morgan.token('body', (req, res) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return ''
})

const app = express()

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

// eslint-disable-next-line no-undef
const mongoUrl = process.env.MONGODB_URI
mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

// eslint-disable-next-line no-undef
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})