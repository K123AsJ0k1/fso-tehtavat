const bcrypt = require('bcrypt')
const usersRouters = require('express').Router()
const User = require('../models/user')

usersRouters.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

usersRouters.post('/', async (request, response) => {
  const { username, password, name } = request.body
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