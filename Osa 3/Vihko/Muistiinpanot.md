# Node.js ja Express

Backendin toteuteusympäristönä käytetty Node.js on palvelimilla ja tietokoneilla toimiva Googlen V8-JavaScript moottoriin perustuva suoritusympäristö. Luodaan sopiva hakemisto ja luodaan projektin runko komennolla npm init. Vastattuamme kysymyksiin saadaan hakemiston juureen sijoitettu package.json, joka muodoltaan:

    {
        "name": "notebackend",
        "version": "0.0.1",
        "description": "",
        "main": "index.js",
        "scripts": {
            "start": "node index.js",
            "test": "echo \"Error: no test specified\" && exit 1"
        },
        "author": "Matti Luukkainen",
        "license": "MIT"
    }

Luodaan vielä tiedosto index.js, joka sisältää:

    console.log('hello world')

Koska tässä on määritelty käynnistämiseen tarkoitettu skripti, niin voidaan tämä tiedosto ajaa komennolla npm start. Huomaa, että npm-projekteille suoritettavat operaatiot on yleensä määritellä nimenomaan npm-skripteinä. Tämä sovellus voidaan muuttaa web-palvelimeksi seuraavasti:

    const http = require('http')

    const app = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain' })
    response.end('Hello World')
    })

    const PORT = 3001
    app.listen(PORT)
    console.log(`Server running on port ${PORT}`)

Tämä voidaan avata osoitteessa http://localhost:3001. Huomaa, että palvelin toimii samalla tavalal riippumatta urlin loppuosasta, eli myös sivun http://localhost:3001/foo/bar sisältö on sama. Muutetaan tätä sovellusta siten, että se palauttaa JSON-muodossa muistiinpanoja:

    let notes = [  
        {    id: 1,    
            content: "HTML is easy",    
            date: "2022-01-10T17:30:31.098Z",    
            important: true  
        },  
        {    
            id: 2,    
            content: "Browser can execute only Javascript",    
            date: "2022-01-10T18:39:34.091Z",    
            important: false  
        },  
        {    
            id: 3,    
            content: "GET and POST are the most important methods of HTTP protocol",    
            date: "2022-01-10T19:20:14.298Z",    
            important: true  
        }
    ]

    const app = http.createServer((request, response) => {  
        response.writeHead(200, { 'Content-Type': 'application/json' })  
        response.end(JSON.stringify(notes))
    })

Huomaa, että headerin Content-Type arvolla application/json kerrotaan, että kyse on JSON-muotoisesta datasta. 

Palvelimen koodin tekeminen suoraan Noden web-palvelimen päälle on mahdollista, mutta työlästä sovelluksen kasvaessa. Tämän helpottamiseksi on luotu monenlaisia rajapinta kirjastoja, joista suosituin on Express. Se voidaan ottaa käyttöön komennolla npm install express. Nyt sovellus voidaan muuttaa muotoon:

    const express = require('express')
    const app = express()

    ...
    
    app.get('/', (req, res) => {
        res.send('<h1>Hello World!</h1>')
    })

    app.get('/api/notes', (req, res) => {
        res.json(notes)
    })

Huomaa, että tässä sovelluksessa määritellään kaksi routea, jotka ovat '/' ja '/api/notes'. Tässä sovelluksessa ei myöskään tarvita käyttää JSON.stringify, sillä expressissä muunnos tapahtuu automaattisesti. Se ei myöskään ole JavaScript olio, vaan merkkijono.

Tarve uudelleenkäynnistelyyn voidaan ratkaista nodemonin avulla, joka voidaan asentaa komennolla npm install --save-dev nodemon. Ohjelma voidaan käynnistää nodemonilla komennolla node_modules/.bin/nodemon index.js, mutta se voidaan tehdä myös "dev": "nodemon index.js", joka suoritetaan komennolla npm run dev.

Laajennettaan tämä sovellus nyt RESTful-periaatteen mukaisesti, jossa yksittäisiä asioita kutsutaan resursseiksi, joilla on yksilöivä URL. Yleinen konventio on muodostaa yksilöivät URL:it liittäen resurssityypin nimi ja resurssin yksilöivä tunniste, kuten yksittäinen muistiinpano on /api/notes/10.

Resursseilla voidaan suorittaa erilaisia operaatioita ja ne määrittelee HTTP-operaation tyyppi, jota kutsutaan verbiksi. Esimerkiksi /api/notes/10 hakee yksittäisen resurssin verbillä GET, kun taas /api/notes hakee verbillä GET kokoelman kaikki resurssit. Tämä mahdollistaa järjestelmien yhteiskäytön.

Hyödyntämällä tätä ideaa voidaan sovelluksen lisätä hakeva route

    app.get('/api/notes/:id', (request, response) => {
        const id = Number(request.params.id)  
        const note = notes.find(note => note.id === id)
        
        if (note) {    
            response.json(note)  
        } else {    
            response.status(404).end()  
        }
    })

ja poistava route

    app.delete('/api/notes/:id', (request, response) => {
        const id = Number(request.params.id)
        notes = notes.filter(note => note.id !== id)

        response.status(204).end()
    })

Huomaa, että hakemisessa käytetään truhty ja falsy idea JavaScript-olioiden kannalta.

On olemassa useita backending testaamiseen helpottavia työkaluja, joista tulemme käyttämään Postmania kurssin aikana. Toinen tapa on käyttää VSCoden REST client pluginia. Lisätään seuraavaksi uusien muistiinpanojen lisäämisen mahdollistava koodi, joka on muodoltaan:

    app.use(express.json())

    const generateId = () => {
        const maxId = notes.length > 0
        ? Math.max(...notes.map(n => n.id))
        : 0
        return maxId + 1
    }

    app.post('/api/notes', (request, response) => {
        const body = request.body

        if (!body.content) {
            return response.status(400).json({ 
            error: 'content missing' 
        })
    }

    const note = {
        content: body.content,
        important: body.important || false,
        date: new Date(),
        id: generateId(),
    }

    notes = notes.concat(note)

    response.json(note)
    })


Huomaa, että ilman app.use(express.json()) pyynnön kentän body arvo olisi ollut määrittelemätön. Se muuttaa saadun JSON-muotoisen datan JavaScript olioksi ja sijoittaa request-olion kenttään body ennen kuin route käsittelijää kutsutaan.

Muista, että ohjelmoidessa backendia sovelluksen suorittava konsoli on oltava koko ajan näkyvillä. Huomaa myös se, että joskus backendissä tiedettävä mitä headereita HTTP-pyynnöille on asetettu. Yksi menetelmä on request olion metodi get. Taas Content-Type tapauksessa komento console.log(request.headers) toimii.

HTTP-standardissa puhutaan pyyntötyyppien yhteydessä kahdesta ominaisuudesta, jotka ovat safe and idempotent. Safetry tarkoittaa, ettei pyynnön suoritus saa aiheuttaa palvelimelle sivuvaikutuksia, kuten muuttaa palvelimen tietokannan tilaa. Idempotence tarkoittaa, että sivuvaikutusten tapauksessa lopputuloksen on oltava sama suorittaessa pyyntö yhden tai useamman kerran.

Expressin json-parsessi on middleware, eli funktio, jonka avulla voidaan käsitellä request ja response oliota. Niitä voi olla käytössä useita, jolloin ne suoritetaan peräkkäin siinä järjestyksessä, kuin ne on otettu koodissa käyttöön. Middlewareja voidaan luoda myös itse ja se voisi olla esimerkiksi:

    const requestLogger = (request, response, next) => {
        console.log('Method:', request.method)
        console.log('Path:  ', request.path)
        console.log('Body:  ', request.body)
        console.log('---')
        next()
    }

Huomaa, että tässä next() mahdollistaa kontrollin siirtämisen seuraavalle middlewarelle. Middleware otetaan käyttöön seuraavasti:

    app.use(requestLogger)

Middlewaret suoritetaan siinä järjestyksessä, jossa ne on otettu käyttöön sovellusolion metodilla use. Tässä on huomattava, että json-parsesi on otettava käyttöön ennen requestLogger:ia, sillä muuten request.body ei ole vielä alustettu. Middlewaret on otettava käyttöön ennen routeja, jos ne halutaan suorittaa ennen niitä, mutta on tapauksia joissa ne halutaan määritellä myöhemmin.

CORS (Cross-origin resource sharing) takia web-sovelluksen selaimessa suoritettava JavaScript-koodi saa oletusarvoisesti kommunikoida vain samassa originissa olevan palvelimen kanssa. Koska palvelin on localhostin portissa 3001 ja frontend localhostin portissa 3000, niin origin ei ole sama. Huomaa, että same origin policy ja CORS ovat yleismaailmassia periaatteita web-sovelluksissa. 

Muista origineista tulevat pyynnöt voidaan sallai käyttämällä Noden cors-middlewarea, joka voidaan asentaa backendiin komennolla npm install cors.

Jos sovellus halutaan siirtää Herokuun, niin on lisättävä tiedosto Procfile, joka kertoo miten sovellus käynnistetään. Asetus web: npm start kertoo käynnistystavan ja index.js lopussa oleva komento const PORT = process.env.PORT || 3001 luo ympäristömuuttujan PORT, joiden avulla Heroku konfiguroi sovelluksen. On myös luotava .gitignore, jossa on seuraava sisältö:

    node_modules

Heroku sovellus voidaan luoda komennolla heroku create ja Git-repositorissa oleva koodi voidaan siirtää git push heroku main tai git push heroku master komennoilla. Jos sovellus ei toimi, niin vian voi selvittää Herokun lokien avulla, jotka voi näyttää komennolla heroku logs. Niiden näyttäminen voidaan automatisoida lisäämällä lippu -t.

Kun sovellus viedään tuotantoon, täytyy siitä tehdä production build, eli tuotantoa varten optimoitu versio. Create-react-app:in avulla tehdyistä sovelluksista saadaan tehtyä tuotantoversio komennolla npm run build, kunhan se suoritetaan frontendin projektin juuressa.

Yksi tapa viedä frontend tuotantoon on kopioida tuotantokoodi, eli hakemiston buildbackending repositiorion juureen ja määritellä backend näyttämään pääsivna frontendin pääsivu build/index.html. Express saadaan näyttämään stattista sisältöä koodilla app.use(express.static('build')). Koska tässä tapauksessa frontend ja backend toimivat samassa osoittessa, määritellään baseUrl suhteellisena.

Frontendin version generointi voidaan tosin suoraviivaistaa ilman turhia manuaalisia askelia seuraavilla skripteillä:

    "scripts": {
        // ...
        "build:ui": "rm -rf build && cd ../part2-notes/ && npm run build && cp -r build ../notes-backend",
        "deploy": "git push heroku main",
        "deploy:full": "npm run build:ui && git add . && git commit -m uibuild && git push && npm run deploy",    
        "logs:prod": "heroku logs --tail"
    }

Huomaa, että npm run build:ui kääntää ui:n tuotantoversioksi ja kopioi sen, npm run deploy julkaisee Herokuun, npm run deploy:full yhdistää nuo molemmat sekä lisää vaadittavat git-komennot versionhallinnan päivittämistä varteen ja npm run logs:prod auttaa lokien lukemisessa. Huomaa, että skriptissä build:ui olevat polut riippuvat repositoirioiden sijainnista.

Näiden lisäksi on lisättävä:

    {
        "dependencies": {
            // ...
        },
        "scripts": {
            // ...
        },
        "proxy": "http://localhost:3001"
    }

Tämä muuttaa Reactin sovelluskehitysympäristön proxyksi, eli React-koodin tehdessä HTTP-pyynnön palvelimen johonkin osoitteseen, joka ei ole sen vastuulla, lähettää se edelleen pyynnön edelleen osoitteessa http://localhost:3001 olevalle palvelimelle.

Negatiivinen puoli tässä lähestymistavassa on se, että frontend on erillisessä repositorissa, mikä hankaloittaa automatisoidun deployment pipelinen toteutusta. Ratkaisut tähän on joko laittaa frontend ja backend samaan repositorioon tai deployätä frontend omana sovelluksena. Näihin tosin palataan takaisin osassa 11.

# Tietojen tallentaminen MongoDB-tietokantaan

Koska nyt tietokanta tulee peliin, tulee sovellukset monimutkaisemmaksi, minkä takia virheet tulevat todennäköisemmäksi. Tästä syystä, kun virheitä tapahtuu, parhain tapa on epäillä kaikkea. Muista käyttää console.logeja, postmania ja debuggereita löytääkseksi virheiden syyt, jotta kykenet systemaattisesti korjaamaan ne. Tämä helpottuu kokemuksen kautta.

Tulemme nyt lisäämään dokumenttitietokanta MongoDB:n, joka ei ole relaatiotietokanta, kuten SQLlite tai PostgresSQL. Sitä tullaan käyttämään melkein jokaisessa kurssin osassa, sillä se on tietokantanoviseille helpompaa, mutta niihin tullaan tutustutaan myöhemmin. 

Dokumenttitietokannat sijoituvat relaatiotietokantojen ja avain-arvotietokantojen välille. Ne perustuvat avain-arvotietokantojen tapaan arvojen tallentamiseen avaimen perustella, mutta arvot (dokumentit) voivat olla monimutkaisia olioita joiden arvona voi olla normaalje arvoja, merkkijonojo tai muita olioita. Ne myös mahdollistavat dokumenttien sisällön suhteen tehdyt kyselyt.

Dokumenttikannoissa loogisena esitysmuotona on JSON, joka voisi olla esimerkiksi MongoDB:n merkinnöissä:

    {
        "id": ObjectId("10"),
        "nimi": "Ohjelmistotekniikka",
        "laajuus": 5,
        "luennot": [ "Matti Luukkainen" ]
    }

JSON-dokumentti siis koostuu avain-arvo-pareista ("avain":arvo), jossa erikoisasemassa on id, jonka arvo on tyypiltään ObjectId. JSON voidaan kirjoittaa myös muodossa:

    {
        "id" : ObjectId("59"),
        "nimi" : "Pekka Mikkola",
        "opiskelijanumero" : 14112345,
        "osoite" : {
                        "katu" : "Tehtaankatu 10 B 1",
                        "postinumero" : "00120",
                        "postitoimipaikka" : "Helsinki"
                    }
    }

Huomaa, että tässä osoite on olio, joka sisältää arvot katu, postinumero ja postitoimipaikka. Dokumenttikannassa dokumentit on lajiteltu kokoelmiin, joilla on melkein sama merkitys kuin taulun relaatiokannassa. Kokoelman dokumenttien ei tosin olla kentiltään samanlaisia, vaan niiden määrä voi vaihdella ja saman nimiset kentät voivat sisältää eri dokumenteilla eri tyyppisen arvon.

On myös täysin sovelluksen vastuulla määritellä, millaisella tavalla kantaan tallennettaan dataa ja että kannasta luettava data tutkitaan oikein. Ne eivät myöskään tarjoa relaatiokantojen mahdollistamia liitosoperaatiotia, mutta on olemassa ohjelmallisia kirjastoja, jotka huolehtivat tästä. Huomaa myös se, että liitostauluissa dokumenttikannoilla voi olla eri ratkaisuja relaatioiden yhteen nähden.

Koska yhtä oikeaa vastausta siihen, miten osvelluksen data kannattaa mallintaa dokumenttikannan kokoelmiksi ja dokumenteiksi ei ole olemassa, niin datamalliksi kannattaa valita yleisemmät operaatiot nopeaksi ja helpoksi tekevät ratkaisut. Dokumenttikannat eivät myöskään tue useamman kokoelman yhtäkaista muuttamista transaktionaalisesit, mutta yhden kokoelman tapahtumat ovat transaktionaalisia.

MongoDB:n voi asentaa paikallisesti omalle koneelle, mutta käytetään palveluna toimivaa mongoa MongoDB Atlas. Käyttäjän, ilmaisen suunnitelman ja klusterin luomisen jälkeen on luotava security välilehdellä tietokantakäyttäjätunnus. Sen jälkeen on määriteltävä ne IP-osoitteet, joista tietokantaan pääsee käsiksi. Kun nämä ovat valmiita, luo yhteys hyödyntämällä annettua URL osoitetta.

Käyttääkseen tätä URL osoitetta, ladataan sovellukselle Mongoose kirjasto komennolla npm install mongoose. Yhteyttä voi testaa seuraavalla esimerkki sovelluksella:

    const mongoose = require('mongoose')

    if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
    }

    const password = process.argv[2]

    const url =
    `mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

    mongoose.connect(url)

    const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
    })

    const Note = mongoose.model('Note', noteSchema)

    const note = new Note({
        content: 'HTML is Easy',
        date: new Date(),
        important: true,
    })

    note.save().then(result => {
    console.log('note saved!')
    mongoose.connection.close()
    })

Lähettämisen jälkeen tarkastele MongoDB Atlasin collections, jossa pitäisi näkyä notessa ollut tieto. Huomaa, että tietokannan nimi voidaan muuttaa vaihtamalla URL osoitteessa olevaa nimeä, kuten:

    mongodb+srv://fullstack:$<password>@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority

Uusia tietokantoja voi luoda itse MongoDB Atlasin avulla, mutta se ei ole tarpeen, sillä se osaa automaattisesti luoda sellaisen.

Määritellään nyt käytetty skeema ja sitä vastaava model seuraavasti:

    const noteSchema = new mongoose.Schema({
        content: String,
        date: Date,
        important: Boolean,
    })

    const Note = mongoose.model('Note', noteSchema)

Huomaa, että tässä 'Note' määritellee Mongoosen tallentamaan muistiinpanoa vastaavat oliot kokoelmaan nimeltään notes, sillä Mongoose konvention mukaan kokoelmien nimet ovat monikossa. Dokumenttikannat ovat tosin skeemattomia, mutta Mongoosea käyttäessä periaatena on kuitenkin se, että tietokantaan talletettavalle tiedolel määritellään sovelluksen koodin tasolla skeema.

Modelit ovat konstruktorifunktioita, eli ne luovat parametrien perusteella JavaScript olioita. Niillä on siis kaikki modelien ominaisuut, joiden avulla olioita voidaan tallettaa tietokantaan. Tallentaminen tapahtuu metodilla save, joka palauttaa promisen, jolle voidaan rekistöröidä seuraava tapahtumakäsittelijä:

    note.save().then(result => {
        console.log('note saved!')
        mongoose.connection.close()
    })

Huomaa, että tässä suljetaan tietokantayhteys komennolla, jotta ohjelma suoritus päättyisi. Tässä talletusoperaation tulos on parametrissa result, jonka voi tulostaa konsoliin tarpeen mukaisesti.

Korvataan nyt sovelluksen uusia muistiinpanoja generoiva seuraavalla koodilla:

    Note.find({}).then(result => {
        result.forEach(note => {
            console.log(note)
        })
        mongoose.connection.close()
    })

Huomaa, että tässä parametrin hakuehto {} tuo kannasta kaikki notes kokoelman oliot. Nämä hakuehdot noudattavat MongoDB:n syntaksia, minkä takia ainoastaan tärketä muistiinpanot voitaisiin hakea parametrilla { important: true }. Nyt tiedetään tarvittavat asiat, joten lisätään sovellukseen index.js tiedostoon seuraavat asiat: 

    const mongoose = require('mongoose')

    // ÄLÄ KOSKAAN TALLETA SALASANOJA GitHubiin!
    const url =
    `mongodb+srv://fullstack:<password>@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority`

    mongoose.connect(url)

    const noteSchema = new mongoose.Schema({
        content: String,
        date: Date,
        important: Boolean,
    })

    const Note = mongoose.model('Note', noteSchema)

    app.get('/api/notes', (request, response) => {
        Note.find({}).then(notes => {
            response.json(notes)
        })
    })

    noteSchema.set('toJSON', {
        transform: (document, returnedObject) => {
            returnedObject.id = returnedObject._id.toString()
            delete returnedObject._id
            delete returnedObject.__v
        }
    })

    app.get('/api/notes', (request, response) => {
        Note.find({}).then(notes => {
            response.json(notes)
        })
    })

Tässä oleva Mongoose spesifi koodi voidaan eriytää hakemistossa models olevaan omaan moduulinsa note.js, joka on muodoltaan:

    const mongoose = require('mongoose')

    const url = process.env.MONGODB_URI
    
    console.log('connecting to', url)
    
    mongoose.connect(url)
        .then(result => {    
            console.log('connected to MongoDB')  
        })  
        .catch((error) => {    
            console.log        
            ('error connecting to MongoDB:', error.message)  
    })
    
    const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
    })

    noteSchema.set('toJSON', {
        transform: (document, returnedObject) => {
            returnedObject.id = returnedObject._id.toString()
            delete returnedObject._id
            delete returnedObject.__v
        }
    })

    module.exports = mongoose.model('Note', noteSchema)

Tämä moduuli voidaan ottaa käyttöön lisäämällä index.js:n seuraava rivi:

    const Note = require('./models/note')

Huomaa, ettei tietokannan osoitetta kannatta kirjoittaa koodiin, vaan järkevämpi tapa on antaa se ympäristömuuttujana MONGODB_URI kautta. Yksi tapa olisi MONGODB_URI=osoite_tahan npm run watch, mutta parempi tapa on dotenv kirjasto, joka voidaan asentaa komennolla npm install dotenv. Sen avulla voidaan luoda tiedosto .env, jonne ympäristömuuttujien arvot määritellään. Muista .gitignorata se.

Nyt index.js voidaan muuttaa seuraavasti:

    require('dotenv').config()const express = require('express')
    const app = express()
    const Note = require('./models/note')
    // ..

    const PORT = process.env.PORTapp.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })

Huomaa, että .env ollessa gitignorattu, herouk ei saa tietoonsa tietokannan osoitetta. Tämän takia se on asetettava itse. Tämä voidaan tehdä joko dashboardin ja komentorivin kautta. Nyt index.js muuttuu:

    app.post('/api/notes', (request, response) => {
        const body = request.body

        if (body.content === undefined) {
            return response.status(400).json({ error: 'content missing' })
        }

        const note = new Note({
            content: body.content,
            important: body.important || false,
            date: new Date(),
        })

        note.save().then(savedNote => {
            response.json(savedNote)
        })
    })

    app.get('/api/notes/:id', (request, response) => {
        Note.findById(request.params.id).then(note => {
            response.json(note)
        })
    })

Kun backendia laajennettaan, niin kannattaa sitä ensiksi testailla postmanin tai REST clientillä, sillä kokeilujen teko frontendin kautta on todennäköisesti tehotonta. Parhain tapa saatta olla edetä frontin ja backin integroinnissa toiminnallisuus kerrallaan. Kannattaa myös hyödyntää MongoDB Atlasin hallintanäkymiä tämän prosessin aikana.

On suositeltavaa, että .catch hyödynnettään erilaisten errorien huomiseen, sillä se vähentää pitkiä ja turhauttavia väärää asiaa debugaavia sessioita. Huomio ohjelmoidessasi, että on pidettävä koko ajan silmää backending konsolin tulostuksiin. 

Koodin seassa olevan virhetilanne käsittelyn sijasta parempi ratkaisu voi olla luoda siihen tarkoitettu middleware, jotta virheet voitaisiin logata ja analysoida myöhemmin. Tämä voidaan tehdä tarkasteltavassa sovelluksessa next funktion avulla, jonka seurauksesta sovellusta voidaan muokata seuraavasti:

    app.get('/api/notes/:id', (request, response, next) => {  
        Note.findById(request.params.id)
            .then(note => {
                if (note) {
                    response.json(note)
                } else {
                    response.status(404).end()
                }
            })
            .catch(error => next(error))})
    })

    const errorHandler = (error, request, response, next) => {
        console.error(error.message)

        if (error.name === 'CastError') {
            return response.status(400).send({ error: 'malformatted id' })
        }

        next(error)
    }

    // tämä tulee kaikkien muiden middlewarejen rekisteröinnin jälkeen!
    app.use(errorHandler)

Koska middlewaret suoritetaan siinä järjestyksessä, missä ne on otettu käyttöön funktiolla app.use, on niiden määrittelyn kanssa oltava tarkkana. Esimerkki oikeaoppisesta järjestyksestä on:

    app.use(express.static('build'))
    app.use(express.json())
    app.use(requestLogger)

    app.post('/api/notes', (request, response) => {
        const body = request.body
    // ...
    })

    const unknownEndpoint = (request, response) => {
        response.status(404).send({ error: 'unknown endpoint' })
    }

    // olemattomien osoitteiden käsittely
    app.use(unknownEndpoint)

    const errorHandler = (error, request, response, next) => {
    // ...
    }

    // virheellisten pyyntöjen käsittely
    app.use(errorHandler)

Tietokantaan tallennettava tieto voidaan tarkastaa ilman routeissa tapahtuvaa tarkastelua hyödyntämällä Mongoosen validointitoimallisuutta, jotka voidaan asettaa skeemassa seuraavalla tavalla:

    const noteSchema = new mongoose.Schema({
        content: {    
            type: String,    
            minlength: 5,    
            required: true  
        },  
        date: {     
            type: Date,    
            required: true  
        },  
        important: Boolean
    })

Huomaa, että tässä content pituuden vaaditaan olevan vähintään viisi merkkiä ja kentälle date taas on asetettu ehdoksi, että sillä on oltava joku arvo eli kenttä ei saa olla tyhjä. Sama ehto on asetettu content kentälle. Tässä important kentälle ei ole asetettu mitään ehtoa, joten se on määritelty yksinkertaisesti.

Tässä käytetyt validaattorit minlength ja required ovat Mongoosen sisäänrakennettuja validointisäätnöjä, mutta custom validator mahdollistaa mielivaltaisten validaattorien luomisen, jos valmiiden joukosta ei löydy tarkoitukseen sopivaa.

Jos yritetään tallentaa validointisäännän riikkova olio, niin tallennusoperaatio heittää poikeuksen. Tämän takia virheenkäsittelijä on laajennettava seuraavasti:

    } else if (error.name === 'ValidationError') {    
        return response.status(400).json({ error: error.message })  
    }

Huomaa, ettei validaatioita suoriteta, sillä oletusarvoisesti findOneAndUpdate ei tee niin. Tämä voidaan korjata seuraavasti:

    Note.findByIdAndUpdate(
        request.params.id, 
        { content, important },    { new: true, runValidators: true, context: 'query' }  ) 

Käydään vielä läpi lint työkalu, jonka avulla voidaan tarkastaa koodi tyylivirheiden varalta. JavaScript maailmassa johtavin työkalu stattiseen analyysiin on ESLint. Se voidaan asentaa backendiin komennolla npm install eslint --save-dev, jonka jälkeen luodaan konfugiraatio komennolla npx eslint --init.

ESLintin konfugiraatio löytyy kysymysten vastaamisen jälkeen tiedostosta .eslintrc.js. Muutetaan sitä seuraavasti:

    "indent": [
        "error",
        2
    ],

Tiedosto voidaan tarkastaa komennolla npx eslint index.js, mutta kannattaa luoda skripti "lint": "eslint .", jotta tarkastus tehtäisiin koko projektiin. Tämän takia build tulee myös tarkastettua, minkä takia luodaan .eslintignore ja lisätään sinne build.

Huomaa, että helpoin tapa käyttää linttiä VSCodella on asentaa ESLint lisäys, joka aktiivisesti tarkastaa tiedostoja. ESLintille voidaan lisätä eri sääntöjä. Huomaa tarkastaa joka kerta, että tehdyt muutokset toimivat. Muutetaan konfugiraatiota seuraavasti:

    'rules': {
      // ...
      'eqeqeq': 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': [
          'error', 'always'
      ],
      'arrow-spacing': [
          'error', { 'before': true, 'after': true }
      ],
      'no-console': 0,    
    },


















