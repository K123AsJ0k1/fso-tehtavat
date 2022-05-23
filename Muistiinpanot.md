# Reactista lisää

On erittäin suositeltavaa, että console.log komennon käyttäminen lisääntyy normaalista, sillä arvaamisen sijasta parempi on logata ja käytää muita debuggauskeinoja. Huomio se, että oikea tapa käyttää tätä komentoa on seuraava:

    console.log('props value is', props)

Seuraava index.js tiedostossa määritelty taulukko 

    const notes = [
        {
            id: 1,
            content: 'HTML is easy',
            date: '2019-05-30T17:30:31.098Z',
            important: true
        },
        {
            id: 2,
            content: 'Browser can execute only JavaScript',
            date: '2019-05-30T18:39:34.091Z',
            important: false
        },
        {
            id: 3,
            content: 'GET and POST are the most important methods of HTTP protocol',
            date: '2019-05-30T19:20:14.298Z',
            important: true
        }
    ]

voidaan käydä läpi App.js tiedostossa läpi seuraavasti:

    const App = (props) => {
        const { notes } = props

        return (
            <div>
            <h1>Notes</h1>
            <ul>
                {notes.map(note => 
                <li key={note.id}>            
                    {note.content}          
                </li>        
                )}
            </ul>
            </div>
        )
    }

Huomaa, että 

    const result = notes.map(note => note.id)
    console.log(result) // Tulostuu [1,2,3]

, jossa note => note.id on komapktissa muodossa kirjoitettu nuolifunktio, joka on täydelliseltä muodoltaan:

    (note) => {
        return note.id
    }

Taas App.js kannalta parempi muotoilu tälle funktiolle saattaa olla:

    note =>
        <li key={note.id}>
            {note.content}
        </li>

Hyödyntämällä destrukointia App.js voidaan muuttaa muotoon:

    const Note = ({ note }) => {  
        return (    
            <li>{note.content}</li>  
        )
    }

    const App = ({ notes }) => {
        return (
            <div>
                <h1>Notes</h1>
                <ul>
                {notes.map(note =>           
                    <Note key={note.id} note={note} />        
                )}      
                </ul>
            </div>
        )
    }

Tässä on huomattava se, että key-attribuutti täytyy nyt määritellä Note-komponenteille, eikä li-tageilel kuten ennen muutosta.

React-sovellus on mahdollista määritellä samassa tiedostossa, mutta se ei ole kovin järkevää. Sen sijasta käytäntö on määritellä yksittäisest komponentit omassa tiedostossa ES6-moduuleina, kuten seuraavat:

    import React from 'react'
    import ReactDOM from 'react-dom/client'

    import App from './App'

Samoin voidaan tehdä Notes komponentille, joten luomalla components hakemisto src-hakemistoon ja luomalla sinne tiedosto Note.js voidaan kirjoittaa App.js koodiin importti seuraavasti:

    import Note from './components/Note'
    
    const App = ({ notes }) => {
    // ...
    }

On huomattava, että importaessa komponentteja niiden sijainti on ilmaistava suhteessa importtavana tiedostoon, kuten './components/Note'. Tässä . viittaa nykyiseen hakemistoon, /components on alihakemisto ja /Note on sen sisältämä tiedosto.

Huomaa, että jos kloonat projektin itsellesi, niin suorita komento npm install ennen käynnistämistä, eli komentoa npm start.

Jos React sovellus räjähtää, niin kannatta tarkastaa console.log komentojen avulla, mitkä sovelluksen osasista ei toimi. Huomaa, että erittäin usein ongelma johtuu siitä, että propsien odotetaan olevan eri muodossa tai eri nimisiä kuin ne oikeasti ovat, jolloin destruktointi epäonnistuu. Ongelma yleensä ratkeaa, kun poistetaan destrukointi ja katsotaan, mitä props oikeasti pitää sisällään. Jos ongelma ei vielä ratkea, niin ainoa ratkaisu on jatkaa console.log ripotelua ympäri koodia.

Lomakkeiden tapauksessa sivun päivittymisen varmistaminen vaati sen, että siihen liittyvä tila sijoitetaan komponentin App tilaan. Tämä voidaan tehdä seuraavasti:

    import { useState } from 'react'import Note from './components/Note'

    const App = (props) => {  
        const [notes, setNotes] = useState(props.notes)

        return (
            <div>
                <h1>Notes</h1>
                <ul>
                    {notes.map(note => 
                    <Note key={note.id} note={note} />
                    )}
                </ul>
            </div>
        )
    }

    export default App 

Huomaa, että jos haluttaisiin lähteä liikkeelle tyhjästä muistiinpanojen listasta, niin const [notes, setNotes] = useState([]).

Haluttu lomake voidaan lisätä seuraavasti:

    const App = (props) => {
        const [notes, setNotes] = useState(props.notes)

        const addNote = (event) => {    
            event.preventDefault()    
            console.log('button clicked', event.target)  
        }

        return (
            <div>
            <h1>Notes</h1>
            <ul>
                {notes.map(note => 
                <Note key={note.id} note={note} />
                )}
            </ul>
            <form onSubmit={addNote}>        
                <input />        
                <button type="submit">save</button>      
            </form>       
            </div>
        )
    }

Huomaa, että event.preventDefault() estää lomakkeen lähettämisen oletusarvoisen toiminnan, joka aiheuttaisi sivun uudelleenlatautumisen. Taas event.target kertoo tapahtuman kohteen, joka on määritelty lomake.

On olemassa eri tapoja päästä käsiksi lomakkeen input komponentin dataan. Kontrolloituna komponentteina se tehdään seuraavasti:

    const App = (props) => {
        const [notes, setNotes] = useState(props.notes)
        
        const [newNote, setNewNote] = useState(    
            'a new note...'  
        ) 
        
        const addNote = (event) => {
            event.preventDefault()
            
            const noteObject = {
                content: newNote,
                date: new Date().toISOString(),
                important: Math.random() > 0.5,
                id: notes.length + 1,
            }

            setNotes(notes.concat(noteObject))
            setNewNote('')
        }

        const handleNoteChange = (event) => {    
            console.log(event.target.value)    
            setNewNote(event.target.value)  
        }

        return (
            <div>
            <h1>Notes</h1>
            <ul>
                {notes.map(note => 
                <Note key={note.id} note={note} />
                )}
            </ul>
            <form onSubmit={addNote}>
                <input 
                    value={newNote} 
                    onChange={handleNoteChange} 
                />        
                <button type="submit">save</button>
            </form>   
            </div>
        )
    }

Tässä on huomattava, että kontrolloidun syötekomponentin editoiminen vaatii tapahtumakäsittelijän, joka synkroinoi syötekenttään tehdyt muutokset App tilaan. Tästä osasesta huolehtii handleNoteChange, jossa event.target.value huolehtii tästä.

Huomaa, ettei tässä tarvita event.preventDefault(), sillä syöstekentän muutoksella ei ole oletusarvoista toimintaa.

Tässä uuden muistiinpanot lisäämisestä huolehtii addNote, jossa luodaan ensin muistiinpanoa vastaava olio noteObject. Sen sisältö saadaan newNote tilasta, sille annettaan päivämääär, siitä tulee 50 % tärkeä ja id generoidaan muistiinpanojen lukumäärän perusteella.

Tämä valmis olio lisätään vanhojen joukkoon hyödyntämällä concat metodia, joka siis luo uuden taulukon. Muista, ettei reactin tilaa saa muuttaa suoraan. Lopuksi syötekenttää kontrolloiva tila newNote tyhjennettään setNewNotella.

Tätä sovellusta voidaan edelleen muokata siten, että näytetäänkö kaikki vai tärkeimmät muistiinpanot seuraavalla tavalla:

    const App = (props) => {
        const [notes, setNotes] = useState(props.notes)
        const [newNote, setNewNote] = useState('') 
        const [showAll, setShowAll] = useState(true)
        
        const addNote = (event) => {
            event.preventDefault()
            const noteObject = {
            content: newNote,
            date: new Date().toISOString(),
            important: Math.random() > 0.5,
            id: notes.length + 1,
            }
        
            setNotes(notes.concat(noteObject))
            setNewNote('')
        }

        const handleNoteChange = (event) => {    
            console.log(event.target.value)    
            setNewNote(event.target.value)  
        }

        const notesToShow = showAll    
            ? notes    
            : notes.filter(note => note.important === true)

        return (
            <div>
                <h1>Notes</h1>
                <div>        
                <button onClick={() => setShowAll(!showAll)>          
                    show {showAll ? 'important' : 'all' }        
                </button>      
                </div>  
                <ul>
                    {notesToShow.map(note => 
                        <Note key={note.id} note={note} />
                        )}
                </ul>
                <form onSubmit={addNote}>
                    <input 
                        value={newNote} 
                        onChange={handleNoteChange} 
                    />        
                    <button type="submit">save</button>
                </form>   
            </div>
        )
    }

Huomaa, että tässä oleva ehdollinen operaattori voidaan ymmärtää siten, että const tulos = ehto ? val1 : val2. Tässä tuloksen arvo saa val1, jos ehto on tosi, joten se saa val2 ehdon ollessaan epätosi.

JavaScriptissä huomaa se, että tyylikkäin tapa muodostaa muuttujan perustuva merkkijono on template string, eli:

    `${newName} is already added to phonebook`

# Datan haku palvelimelta

Backendin eli palvelinpuolen voidaan toteuttaa helposti JSON serverillä, joka voidaan asentaa globaalisti komennolla npm install -g json-server. Tämä vaatii pääkäyttäjän oikeuksia, minkä takia vaihtoehtoinen tapa on käynnistää komennolla npx json-server --port=3001 --watch db.json.

Huomaa, että oletusarvoisesti JSON serveri käynnistyy porttiin 3000, mutta create-react-app:ien sovellusten varatessa kyseisen portin, on JSON serverit määriteltävä vaihtoehtoiseen portiin 3001. Avamalla osoitteen http://localhost:3001/notes sivun saadaan db.jsonin tallennettut tiedot:

    {
        "notes": [
            {
            "id": 1,
            "content": "HTML is easy",
            "date": "2022-1-17T17:30:31.098Z",
            "important": true
            },
            {
            "id": 2,
            "content": "Browser can execute only JavaScript",
            "date": "2022-1-17T18:39:34.091Z",
            "important": false
            },
            {
            "id": 3,
            "content": "GET and POST are the most important methods of HTTP protocol",
            "date": "2022-1-17T19:20:14.298Z",
            "important": true
            }
        ]
    }

JSON server tallentaa kaiken datan palvelimella sijaitsevaan tiedostoon db.json. Todellisuudessa data tullaan tallentamaan johonkin tietokantaan, mutta JSON Server on kuitenkin käyttökelpoinen apuväline, joka mahdollistaa palvelinpuolen toiminnallisuuden käyttämisen kehitysvaiheessa.

JavaScript suoritusympäristö noudattaa asynkronista mallia, eli IO-operaatiot suoritetaan ei-blokkaavana, joten operaatioiden tulosta ei jäädä odottamaan van koodin suoritusta jatketaan heti eteenpäin. Kun operaatio valmistuu, kutsutaan operaation tapahtumakäsittelijöitä.

Huomaa, että tämä suoritusympäristö on yksisäkeinen, eli ne eivät voi suorittaa rinnakkaista koodia. Tämän takia on pakko käyttää ei-blokkaava mallia IO-operaatioiden suoritukseen, sillä muuten selain jäätyisi haettaessa palvelimelta dataa.

Samasta syystä, jos koodin suoritus kestää pitkään, niin selain menee jumiin suorituksen ajaksi. Esimerkiksi Chromessa selain tabia ei pysty edes sulkemaan pitkän suorituksen aikana. Tämän takia koodin logiikka on oltava sellainen, ettei yksittäinen laskenta kestä liian kauan.

On olemassa eri tapoja hakea dataa palvelimelta (kuten fetch funktio), mutta tarkastellaan axios-kirjastoa, koska sen avulla voidaan tarkastellaa npm-pakettejen liittämistä react-projektiin. Lähes kaikki JavaScript projektit ovat npm avulla luotuja ja varma merkki on package.json.

Huomaa, että npm komennot tulee antaa aina juurihakemistossa, eli siinä paikassa, jossa package.json on. Axios-kirjasto voidaan asentaa komennolla npm install axios. Asennettan sen lisäksi npm install json-server ---save-dev ja muutetaan package.json seuraavasti:

    "scripts": {
        "start": "react-scripts start",
        "build": "react-scripts build",
        "test": "react-scripts test",
        "eject": "react-scripts eject",
        "server": "json-server -p3001 --watch db.json"  
    },

Tämän skriptin avulla voidaan JSON serveri käynnistää mukavasti hakemistosta komennolla npm run server ilman parametrien määrittelyä. Huomaa, että axios tallennettiin sovelluksen suoritusaikaiseksi riippuvuudeksi ja JSON server sovelluskehityksen aikaiseksi.

Axios voidaan importoida

    import axios from 'axios'

avulla ja sen get metodia käytetään

    const promise = axios.get('http://localhost:3001/notes')

avulla. Tässä get palauttaa promisen, mikä edustaa asynksonista operaatiota, joka voi olla kolmessa eri tilassa:

- Promise on pending, eli promisea vastaava asynkroninen operaatio ei ole vielä tapahtunut
- Jos operaatio päättyy onnistuneesti, promise menee tilaan fulfilled, josta joskus käytetään nimeä resolved
- Jos operaatio epäonnistuu, niin promise menee tilaan rejected
  
Promisen tuomaa dataa voidaan tarkastella seuraavasti:

    const promise = axios.get('http://localhost:3001/notes')

    promise.then(response => {
        console.log(response)    
    })

Tässä tapahtumakuuntelijassa then metodi rekistöröi takaisinkutsufunktion ja antaa silel parametriksi olion response, joka sisältää kaiken oleellisen HTTP GET- pyynnön vastaukseen liittyvän. Huomaa, ettei promise-oliota tarvitse tallettaa muuttujaan, joten voidaan tehdä seuraavasti:

    axios.get('http://localhost:3001/notes').then(response => {
        const notes = response.data
        console.log(notes)
    })

Luettavampi tapa tälle olisi:

    axios
        .get('http://localhost:3001/notes')
        .then(response => {
            const notes = response.data
            console.log(notes)
        })

Huomaa, että palvelimen palauttama data on pelkkää tekstiä, eli yksi iso merkkijono. Axios ossa kuitenkin parsia datan JavaScript-taulukoksi, sillä palvelin on kertonut headerin content-type avulla datan muodon olevan application/json; charset=utf-8. 

Näiden avulla index.js muuttuu seuraavasti:

    import React from 'react'
    import ReactDOM from 'react-dom/client'

    import App from './App'

    ReactDOM.createRoot(document.getElementById('root')).render(<App />)

Taas App.js muuttu muotoon:

    import { useState, useEffect } from 'react'import axios from 'axios'
    import Note from './components/Note'

    const App = () => {
        const [notes, setNotes] = useState([])  
        const [newNote, setNewNote] = useState('')
        const [showAll, setShowAll] = useState(true)

        useEffect(() => {    
            console.log('effect')    
            axios      
                .get('http://localhost:3001/notes')      
                .then(response => {       
                     console.log('promise fulfilled')        
                     setNotes(response.data)      
                })  
        }, [])  
        console.log('render', notes.length, 'notes')
        // ...
    }

Huomaa, että tässä useEffect:in funktio suoritetaan heti renderöinnin jälkeen. Tämä saa aikaan sen, että axios.get aloittaa datan hakemisen palvelimelta sekä rekistöröi operaatiolle tapahtumakäsittelijäksi seuraavan funktion: 

    response => {
        console.log('promise fulfilled')
        setNotes(response.data)
    })

Kun data saapuu palvelimelta, tämä funktio tulostaa konsoliin promise fulfilled ja talletnaa tilaan palvelimen palauttamat muistiinpanot funktiolla setNotes(response.data). Sen jälkeen komponentti uudelleen renderöityy, konsoliin tulostuu render 3 notes ja muistinpanot näkyvät ruudulla.

Tämä useEffect muoto voidaan kirjoittaa myös seuraavasti:

    const hook = () => {
        console.log('effect')
        axios
            .get('http://localhost:3001/notes')
            .then(response => {
            console.log('promise fulfilled')
            setNotes(response.data)
        })
    }

    useEffect(hook, [])

Näin huomataan, että oletusarvoisesti efekti suoritetaan aina sen jälkeen, kun komponentti renderöidään. Funktion useEffect toista parametria käytetään tarkentamaan sitä, miten usein efekti suoritetaan. Jos toisena parametrina on tyhjä taulukko [], suoritetaan efekti ainaoastaan kompoentin ensimmäisen renderöinnin jälkeen. Tämä koodi voidaan myös kirjoittaa seuraavasti:

    useEffect(() => {
        console.log('effect')

        const eventHandler = response => {
            console.log('promise fulfilled')
            setNotes(response.data)
        }

        const promise = axios.get('http://localhost:3001/notes')
        promise.then(eventHandler)
    }, [])

