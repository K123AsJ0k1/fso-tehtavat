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

# Backendin testaaminen

Tarkastellaan nyt backending testausta. Koska backend ei sisällä monimutkaista laskentaa, niin yksikkötestejä ei kannata tehdä, sillä ainoa potentiaalinen kohden olisi muistiinpanojen metodi toJSON. Jossain tilanteissa voisi olla mielekästä, että oikean tietokannan sijasta käytetään mockia, johon on olemassa ratkaisu mongodb-memory-server. Sovelluksen yksikertaisuuden takia tulemme tosin tarkastelemaan integraatiotesteja, jotka yhdistävät backendin ja tietokannan käytön.

Noden konventiona on määritellä projektin suoritusmoodi ympäristömuuttujan NODE_ENV mukaisesti, minkä taia package.json muuttuu seuraavasti:

    "scripts": {
        "start": "NODE_ENV=production node index.js",    
        "dev": "NODE_ENV=development nodemon index.js",    
        ///...        
        "test": "NODE_ENV=test jest --verbose --runInBand"  
    },

Huomaa, että tässä runInBand estää testien rinnakkaisen suorituksen. Tämä määrittely ei tosin toimi windowsilla, minkä takia on ladattava kirjasto cross-env seuraavalla komennolla npm install --save-dev cross-env ja muuttamalla package.json muotoon:

    "scripts": {
        "start": "cross-env NODE_ENV=production node index.js",
        "dev": "cross-env NODE_ENV=development nodemon index.js",
        // ...
        "test": "cross-env NODE_ENV=test jest --verbose --runInBand",
    },

Sovelluksen testikanta voidaan luoda MongoDB Atlasiin, mutta tämä ei ole optimallinen, sillä testien suoritus vaatii ainoastaan yhtä tietokannan aktiivista käyttäjää. Parempi ratkaisu on käyttää paikallisella koneella olevaa tietokantaa, joita löytyisi optimitapauksessa jokaiselle testiajolle. Tämän sovelluksen tapauksessa mennään lyhyemmän kaavan kautta, minkä takia tullaan käyttämään normaalia mongon tietokantaa, joten muutetaan konfiguraatiota seuraavasti:

    const MONGODB_URI = process.env.NODE_ENV === 'test'   
        ? process.env.TEST_MONGODB_URI  
        : process.env.MONGODB_URI
    
Tämän lisäksi tiedostoon .env on määritelty erikseen osoite TEST_MONGODB_URI. Käytännössä config-moduuli toimii samassa hengessä kuin node-config kirjasto. Se sopii tarkoitukseen, sillä sovellus on yksinkertainen, mutta isommissa sovelluksissa kannattaa harkita valmiiden kirjastojen käyttöä.

Tulemme käyttämään API:n testaamisessa Jestin kanssa SuperTest kirjastoa, joka voidaan asentaa komennolla npm install --save-dev supertest. Luodaan ensimmäinen testi tiedostoon tests/note_api.test.js, joka muodoltaan:

    const mongoose = require('mongoose')
    const supertest = require('supertest')
    const app = require('../app')

    const api = supertest(app)

    test('notes are returned as json', async () => {
        await api
            .get('/api/notes')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    afterAll(() => {
       mongoose.connection.close() 
    })

Tässä app.js muutetaan apin tallennettavaan superagent-olioksi, jota testataan hakemalla tekemällä HTTP GET osoitteeseen api/notes, varmistamalla statuskoodin 200 lähetys ja tarkastamalla Content-Typen arvo appliccation/json. Huomaa, että tähän on lisätty async ja await, joista ei vielä tarvitse välittää. Niin kauan kuin testit kirjoitetaan tämän esimerkin mukaisesti, niin kaikki testit tulevat toimimaan. Jokaisen testin lopuksi on katkaistava tietokantayhteys, joka tehdään komennolla:

    afterAll(() => {
      mongoose.connection.close()  
    })

Tulet todennäköisesti saamaan virheilmoituksen, joka korjataan muuttamalal package.json:ia seuraavasti:

    "test": "cross-env NODE_ENV=test jest --verbose --runInBand --forceExit"

Huomaa, että testit käyttävät ainoastaan tiedostossa app.js määriteltyä express-sovellusta. Taas supertest huolehtii testattavan sovelluksen käynnistämisestä sisäisesti käyttämäänsä porttiin.

HTTP-pyyntöjä kirjoittavat middlewaret häiritsevät hiukan testien tulostusta, minkä takia muutetaan sitä seuraavasti:

    const info = (...params) => {
        if (process.env.NODE_ENV !== 'test') {     console.log(...params)  }
    }

    const error = (...params) => {
        if (process.env.NODE_ENV !== 'test') {     console.error(...params)  }
    }

Testien alkaessa tietokannan tila on nollattava ja sen jälkeen kantaan on hallitusti lisättävä testien tarvitsema data. Tämä voidaan tehdä funktiolla beforeEach seuraavasti:

    const Note = require('../models/note')

    const initialNotes = [  
        {    
            content: 'HTML is easy',    
            date: new Date(),    
            important: false,  
        },  
        {    
            content: 'Browser can execute only Javascript',    
            date: new Date(),    
            important: true,  
        },
    ]
    
    beforeEach(async () => {  
        await Note.deleteMany({})  
        let noteObject = new Note(initialNotes[0])  
        await noteObject.save()  
        noteObject = new Note(initialNotes[1])  
        await noteObject.save()
    })

Kun testitiedostot ovat valmiit, niin hyvä tapa suorittaa testit on komennolla npm test -- -t 'a specific note is within the returned notes', jonka avulla voidaan suorittaa ainoastaan tietty testi tai describe lohko. Huomaa, että yksittäisissä testeisssä Mongoose yhteys saaattaa jäädä auksi, minkäli yhtään yhteyttä hyödyntävää testiä ei ajeta, sillä SuperTest alustaa sen ja Jest ei suorita afterAll osiota.

Async- ja await ovat ES7 tuoma syntaksi, joka mahdollistaa promisen palauttavien asynkronisten funktioiden kutsumisen siten, että kirjoitettava koodi näyttää synkroniselta. Normaalisti promisen hoidetaan seuraavasti:

    Note.find({}).then(notes => {
        console.log('operation returned the following notes', notes)
    })

Tässä Note.find() palauttaa promisen ja sen tulos rekistöröidään metodilla then, jonka sisällä suoritetaan tarvittavat operaatiot. Valitettavasti tämä voi aiheuttaa monimutkaista koodia useiden asynkroniste funktiokutsujen tapauksessa, jolloin voi syntyä callback-helvetti. Tämä voidaan estää ketjuttamalla promiseja, kuten seuraavasti:

    Note.find({})
        .then(notes => {
            return notes[0].remove()
        })
        .then(response => {
            console.log('the first note is removed')
            // more code here
        })

Parempaan tosin pystytään hyödyntämällä ascync ja await syntaksia. Voimme esimerkiksi hakea kaikki muistiinpanot await:n avulla seuraavasti:

    const notes = await Note.find({})

    console.log('operation returned the following notes', notes)

Tätä edeltävä esimerkki voitaisiin taas kirjoittaa seuraaavasti:

    const notes = await Note.find({})
    const response = await notes[0].remove()

    console.log('the first note is removed')

Koodi on nyt yksinkertaistettu merkittävästi entiseen then-ketjuun nähden. Huomattavaa on tosin se, että awaitin tapauksessa on palautettava promise ja sitä ei voida käyttää jokaisessa paikassa, vaan sen käyttö onnistuu ainoastaan async funktiossa. Näin kokonaisuudessaan saadaan seuraava koodi:

    const main = async () => {  
        const notes = await Note.find({})
        console.log('operaatio palautti seuraavat muistiinpanot', notes)

        const response = await notes[0].remove()
        console.log('the first note is removed')
    }

    main()

Koodia refaktoroidessa on aina regression vaara, eli toimineet ominaisuudet voivat hajota. Tämän takia tehdään se siten, että luodaan näitä ominaisuudet varmistavat testit. Huomaa, että käyttäessä async/awaitia try/catch:in käyttö on mahdollista, kuten seuraavasti:

    notesRouter.post('/', async (request, response, next) => {
        const body = request.body

        const note = new Note({
            content: body.content,
            important: body.important || false,
            date: new Date(),
        })
        try {    
            const savedNote = await note.save()    
            response.status(201).json(savedNote)  
        } catch(exception) {    
            next(exception)  }
    })

Tämä tosin voidaan eliminoida hyödyntämällä kirjastoa express-async-errors, joka voidaan asentaa komennolla npm install express-async-errors. Se otetaan käyttöön app.js tiedostossa lisäämällä require('express-async-errors'), jonka jälkeen 

    notesRouter.delete('/:id', async (request, response, next) => {
        try {
            await Note.findByIdAndRemove(request.params.id)
            response.status(204).end()
        } catch (exception) {
            next(exception)
        }
    })

voidaan muuttaa muotoon

    notesRouter.delete('/:id', async (request, response) => {
        await Note.findByIdAndRemove(request.params.id)
        response.status(204).end()
    })

Tämän takia next(exeption) ei tarvita, sillä kirjasto huolehtii siitä, että async routen virheet siirtyvät automaattisesti virheenkäsittely middlewarelle.

Jos nyt tarkastellaan beforeEach funktiota, niin voidaan se muuttaa Promise.all avulla seuraavaan muotoon:

    beforeEach(async () => {
        await Note.deleteMany({})

        const noteObjects = helper.initialNotes
            .map(note => new Note(note))
        const promiseArray = noteObjects.map(note => note.save())
        await Promise.all(promiseArray)
    })

Tässä noteObjects sisältää Note:lla generoidut Mongoose-oliot, promiseArray sisältää niiden jokaisen promiset ja metodi Promise.all hyväksyy muuttamalla ne yhdeksi promiseksi. Huomaa, että tarvittaessa Promise.all parametreihin päästään käsiksi, sillä const result = await Promise.all(promiseArray) palauttaa operaation taulukot. Se myös suorittaa syötteenä saatuja promiseja rinnakkain, joten suoritusjärjestyksen tärkeyden tapauksessa tämä aiheuttaa ongelmia. Tämä voidaan korjata for-each avulla, kuten:

    beforeEach(async () => {
        await Note.deleteMany({})

        for (let note of initialNotes) {
            let noteObject = new Note(note)
            await noteObject.save()
        }
    })

On suositeltavaa olla tarkkana async/await kanssa, sillä asynkroninen suoritusmalli aiheuttaa helposti yllätyksiä, minkä takia promisejen toiminta on syytä tuntea mahdollisimman hyvin. Helpoiten tilanteesta pääsee käyttämällä Mongooen valmista metodia insertMany, kuten seuraavasti:

    beforeEach(async () => {
        await Note.deleteMany({})
        await Note.insertMany(helper.initialNotes)
    })