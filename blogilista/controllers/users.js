const bcrypt = require('bcrypt')
const usersRouters = require('express').Router()
const User = require('../models/user')

usersRouters.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

usersRouters.post('/', async (request, response) => {
  const { username, password, name } = request.body

  if (typeof username !== 'string' || typeof password !== 'string') {
    return response.status(400).json({
      error: 'username and password must be string'
    })
  }

  if (username.length < 3 || password.length < 3) {
    return response.status(400).json({
      error: 'username and password must be atleast 3 characters long'
    })
  }

  const existingUser = await User.findOne({ username })

  if (existingUser) {
    return response.status(400).json({
      error: 'username must be unique'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    passwordHash,
    name,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouters