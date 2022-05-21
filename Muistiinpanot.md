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

