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
















