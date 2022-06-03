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

Tähän mennessä on laiminlyöty kokonaan automatisoitua testaamista, joten tarkastellaan sen luomista Node-sovelluksille. Tulemme käyttämään JavaScriptin testikirjastoa Jest:iä, sillä se sopii backendin ja reactin testaamiseen. Huomaa, että jest ei välttämättä toimi windowsilla, jos projektin hakemisto polulla on hakemisto, jonka nimessä on välilyöntejä. Jest voidaan asentaa komennolla npm install --save-dev jest. Asennuksen jälkeen määritellään sen suoritus skriptiksi:

    "test": "jest --verbose"

Jestille on lisäksi kerrottava, mikä suoritusympäristö on käytössä, joten asetetaan:

    "jest": {
        "testEnvironment": "node"
    }

Huomaa, että ESLint tulee valittamaan testien komennoista, joten poistetaan se lisäämällä .eslintrc.js-tiedostoon env arvo "jest":true:

    'env': {
        'commonjs': true,
        'es2021': true,
        'node': true,
        'jest': true,  
    },

Yksittäisen testitapauksen funktio voisi olla seuraava:

    () => {
        const result = reverse('react')

        expect(result).toBe('tcaer')
    }

Tässä ensiksi generoidaan react palidromi, jonka jälkeen tulos testataan exprect funktion avulla. Huomaa, että jest olettaa testitiedoston nimessä olevan merkkijono .test, minkä takia tällä kurssilla testitiedostojen nimen loppu on .test.js. Yksittäistä metodia voidaan testata eri tavoilla seuraavasti:

    const average = require('../utils/for_testing').average

    describe('average', () => {
        test('of one value is the value itself', () => {
            expect(average([1])).toBe(1)
        })

        test('of many is calculated right', () => {
            expect(average([1, 2, 3, 4, 5, 6])).toBe(3.5)
        })

        test('of empty array is zero', () => {
            expect(average([])).toBe(0)
        })
    })

Tässä decribe-lohkon avulla luotiin looginen kokonaisuus nimeltään average, joka testattiin kolmella eri testillä. Huomaa se, että testit on kirjoitettu tiivimmässä muodossa, eli niissä ei otettu metodin tulosta erikseen apumuuttujaan. 