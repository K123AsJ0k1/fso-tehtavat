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



