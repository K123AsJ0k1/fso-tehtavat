//const http = require('http')
const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')

const logger = require('./utils/logger')
const mongoose = require('mongoose')


//const cors = require('cors')
//const mongoose = require('mongoose')
//const Blog = require('./models/blog')
//const blogsRouter = require('./controllers/blogs')


//const app = express()

// eslint-disable-next-line no-undef
mongoose.connect(config.MONGODB_URI)

app.use(cors())
app.use(express.json())
//app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
/*

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
*/
app.use('/api/blogs', blogsRouter)

// eslint-disable-next-line no-undef
app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})


/*
const app = require('./app') // varsinainen Express-sovellus
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')

const server = http.createServer(app)

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
*/