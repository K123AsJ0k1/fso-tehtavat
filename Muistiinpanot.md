# Sovelluksen rakenne ja testauksen alkeet

Ennen kuin tarkastelemme testausta, käydään läpi loggerit. Ainoastaan console.log ja console.error käyttäminen ei ole järkevää, minkä takia eristetään konsooliin tulostelu omaan moduuliin utils/logger.js, joka on muodoltaan:

    const info = (...params) => {
        console.log(...params)
    }

    const error = (...params) => {
        console.error(...params)
    }

    module.exports = {
        info, error
    }

Tämän avulla voidaan kirjoittaa logeja tiedostoon tai kerätä niitä johonkin ulkoiseen palveluun. Nyt index.js:n lisätään

    const logger = require('./utils/logger')

    server.listen(config.PORT, () => {
        logger.info(`Server running on port ${config.PORT}`)
    })

ja ympäristömuuttujien käsittely eritytetään moduuliin utils/config.js vastuulle:

    require('dotenv').config()

    let PORT = process.env.PORT
    let MONGODB_URI = process.env.MONGODB_URI

    module.exports = {
        MONGODB_URI,
        PORT
    }

Sovelluksen muut osat pääsevät niihin käsiksi importilla:

    const config = require('./utils/config')

Siirretään myös routejen määrittely omaan tiedostoonsa controllers/notes.js. Käytännössä tämä tiedosto on copy-paste index.js:stä, mutta se erottuu komennoilla:

    const notesRouter = require('express').Router()

    //...

    module.exports = notesRouter

Huomaa myös se, että polut ovat lyhentyneet, sillä nyt riittää määritellä:

    notesRouter.delete('/:id', (request, response) => {

Syy tähän on se, että app.js määrittelee routerin käyttämisen seuraavasti:

    const notesRouter = require('./controllers/notes')
    app.use('/api/notes', notesRouter)

Nyt sovellus näyttää seuraavanlaiselta:

    const config = require('./utils/config')
    const express = require('express')
    const app = express()
    const cors = require('cors')
    const notesRouter = require('./controllers/notes')
    const middleware = require('./utils/middleware')
    const logger = require('./utils/logger')
    const mongoose = require('mongoose')

    logger.info('connecting to', config.MONGODB_URI)

    mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connection to MongoDB:', error.message)
    })

    app.use(cors())
    app.use(express.static('build'))
    app.use(express.json())
    app.use(middleware.requestLogger)

    app.use('/api/notes', notesRouter)

    app.use(middleware.unknownEndpoint)
    app.use(middleware.errorHandler)

    module.exports = app

Tässä itse toteutetut middlewaret on siirretty tiedostoon utils/middleware.js, joka on muodoltaan:

    const logger = require('./logger')

    const requestLogger = (request, response, next) => {
        logger.info('Method:', request.method)
        logger.info('Path:  ', request.path)
        logger.info('Body:  ', request.body)
        logger.info('---')
        next()
    }

    const unknownEndpoint = (request, response) => {
        response.status(404).send({ error: 'unknown endpoint' })
    }

    const errorHandler = (error, request, response, next) => {
        logger.error(error.message)

        if (error.name === 'CastError') {
            return response.status(400).send({ error: 'malformatted id' })
        } else if (error.name === 'ValidationError') {
            return response.status(400).json({ error: error.message })
        }

        next(error)
    }

    module.exports = {
        requestLogger,
        unknownEndpoint,
        errorHandler
    }

Sovelluksen ollessa pieni rakenteella ei ole suurta merkitystä, mutta sovelluksen kasvaessa on kannattavaa muodostaa jonkinlainen rakenne ja jakaa erilaiset vastuut omiin moduuleihin, koska se helpottaa jatkokehitystä.

Tässä sovelluksessa on käytetty kahta tapaa exportata, jotka ovat:

    module.exports = {  
        info, error
    }

    const { info, error } = require('./utils/logger')

Taas seuraavassa exportataan ainoastaan yksi asia:

    module.exports = notesRouter