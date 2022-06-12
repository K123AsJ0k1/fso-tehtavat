# Kirjautuminen frontendissä

Tarkastellaan nyt, miten toteuttaa käyttäjänhallinnan edellyttämä toiminnallisusu frontendiin. Lisätään tarkasteltuun sovellukset seuraavat asiat:

    const [username, setUsername] = useState('')   
    const [password, setPassword] = useState('') 
    const [user, setUser] = useState(null)

    const handleLogin = (event) => {    
        event.preventDefault()    

        try {      
            const user = await loginService.login({        
                username, password,      
            })      
            setUser(user)      
            setUsername('')      
            setPassword('')    
        } catch (exception) {      
            setErrorMessage('wrong credentials')     
            setTimeout(() => {        
                setErrorMessage(null)      
            }, 5000)    
        }
    }

    <h2>Login</h2>      
        <form onSubmit={handleLogin}>        
            <div>          
                username            
                    <input            
                        type="text"            
                        value={username}            
                        name="Username"            
                        onChange={({ target }) => setUsername(target.value)}          
                    />        
                </div>        
                <div>          
                    password            
                        <input            
                            type="password"            
                            value={password}            
                            name="Password"            
                            onChange={({ target }) => setPassword(target.value)}          
                    />        
                </div>        
                    <button type="submit">login</button>      
                </form>

Tähän tarvitaan tiedostossa services/login oleva koodi, joka on muodoltaan:

    import axios from 'axios'
    const baseUrl = '/api/login'

    const login = async credentials => {
        const response = await axios.post(baseUrl, credentials)
        return response.data
    }

    export default { login }

Tämä ei tosin näytä onnistunutta kirjautumista, jonka takia on määriteltävä apufunktiot

    const loginForm = () => (
        <form onSubmit={handleLogin}>
            <div>
                username
                    <input
                    type="text"
                    value={username}
                    name="Username"
                    onChange={({ target }) => setUsername(target.value)}
                />
         </div>
        <div>
            password
                <input
                type="password"
                value={password}
                name="Password"
                onChange={({ target }) => setPassword(target.value)}
            />
        </div>
            <button type="submit">login</button>
        </form>      
    )

    const noteForm = () => (
        <form onSubmit={addNote}>
            <input
                value={newNote}
                onChange={handleNoteChange}
            />
            <button type="submit">save</button>
        </form>  
    )

ja muutetaan App:in palautus seuraavaan muotoon:

    return (
        <div>
        <h1>Notes</h1>

        <Notification message={errorMessage} />

        {user === null && loginForm()}      {user !== null && noteForm()}
        <div>
            <button onClick={() => setShowAll(!showAll)}>
            show {showAll ? 'important' : 'all'}
            </button>
        </div>
        <ul>
            {notesToShow.map((note, i) => 
            <Note
                key={i}
                note={note} 
                toggleImportance={() => toggleImportanceOf(note.id)}
            />
            )}
        </ul>

        <Footer />
        </div>
    )

Huomaa, että tässä { user === null && loginForm() } toimii siten, että ensimmäisen osan ollessa falsy toista osaa ei suoriteta ollenkaan. Tätä voidaan suoraviivaistaa seuraavasti:

    {user === null ?
      loginForm() :
      noteForm()
    }

Muutetaan tätä osaa vielä siten, että käyttäjän nimi renderöidään sivulla:

    {user === null ?
      loginForm() :
      <div>
        <p>{user.name} logged in</p>
        {noteForm()}
      </div>
    }

Tässä sovelluksessa frontend tallentaa backendin lähettämän tokenin tilaan user, minkä takia sen käyttämiseen on noteService moduuli muutettava seuraavasti:

    import axios from 'axios'
    const baseUrl = '/api/notes'

    let token = null

    const setToken = newToken => {  
        token = `bearer ${newToken}`
    }
    
    const getAll = () => {
        const request = axios.get(baseUrl)
        return request.then(response => response.data)
    }

    const create = async newObject => {
        const config = {    
            headers: { Authorization: token },  
        }
        const response = await axios.post(baseUrl, newObject, config)  return response.data
    }

    const update = (id, newObject) => {
        const request = axios.put(`${ baseUrl } /${id}`, newObject)
        return request.then(response => response.data)
    }

    export default { getAll, create, update, setToken }

Tämän hyödyntäminen vaatii vielä sen, että handleLogin sisälle lisätään komento:

    noteService.setToken(user.token)

Valitettavasti sovellus ei vielä varsinaisesti tallenna tietoja mihinkään, joten hyödynnettään selaimen local storagea sovelluskehityksen helpottamiseksi, joka on avain-arvo periaattella toimiva tietokanta. Local Storageen voidaan tallentaa komennolla

    window.localStorage.setItem('name', 'juha tauriainen')

, sieltä voidaan hakea komennolla

    window.localStorage.getItem('name')

ja sen tietoja voidaan poistaa komennolla

    window.localStorage.removeItem('name')

Local storagen arvot säilyvät vaikka sivuuudelleenladattaisiin ja ne ovat origin kohtaisia, eli jokaisella selaimella on oma storagensa. Local storagen tietoja voidaan tarkastella konsolin avulla. Koska storagen arvot ovat merkkijonoja, emme voi tallentaa oliota, vaan ne on muutettava ensin JSON muotoon komennolla JSON.stringify ja hakiessa parsittava takaisin metodilla JSON.parse. Näillä tiedoilla sovelluksen kirjautumisesta huolehtiva funktio saa komennon: 

    window.localStorage.setItem(        
        'loggedNoteappUser', JSON.stringify(user)      
    ) 

Nyt on vielä lisättä effect hook, joka hakee kirjautuneen käyttäjän tiedot seuraavalla tavalla:

    useEffect(() => {    
      const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')    
      if (loggedUserJSON) {      
          const user = JSON.parse(loggedUserJSON)      
          setUser(user)      
          noteService.setToken(user.token)    
        }  
    }, [])

Muista, että tässä tyhjä taulukko varmistaa sen, että efekti suoritetaan ainoastaan komponentin renderöidessä ensimmäistä kertaa. Tällä hetkellä riittää, että uloskirjautuminen tapahtuu kirjoittamalla konsoliin joko 

    window.localStorage.removeItem('loggedNoteappUser')

tai 

    window.localStorage.clear()

# props.children ja proptypet

Muutetaan tarkasteltua sovellusta siten, että kirjautumislomake ilmestyy painamalla log in ja poistuu painamalla cancel. Tämä voidaan tehdä seuraavasti:
    
    const [loginVisible, setLoginVisible] = useState(false)

    const LoginForm = ({
        handleSubmit,
        handleUsernameChange,
        handlePasswordChange,
        username,
        password
    }) => {
        const hideWhenVisible = { display: loginVisible ? 'none' : '' }
        const showWhenVisible = { display: loginVisible ? '' : 'none' }
        return (
            <div>
                <div style={hideWhenVisible}>
                    <button onClick={() => setLoginVisible(true)}>log in</button>
                </div>
                <div style={showWhenVisible}>
                <LoginForm
                    username={username}
                    password={password}
                    handleUsernameChange={({ target }) => setUsername(target.value)}
                    handlePasswordChange={({ target }) => setPassword(target.value)}
                    handleSubmit={handleLogin}
                />
                <button onClick={() => setLoginVisible(false)}>cancel</button>
                </div>
            </div>
        )
    }

    export default LoginForm

Tässä propsit otetaan vastaan destruktoimalla, eli kentät otetaan vastaan omiin muuttujiinsa. Itse piilottaminen perustuu CSS:n määrittelyn hyödyntämiseen. Eristetään tästä kirjautumislomakeen näkyvyyttä ympäröivä koodi omaan komponenttiinsa Togglable, jonka koodi on seuraava:

    import { useState } from 'react'

    const Togglable = (props) => {
        const [visible, setVisible] = useState(false)

        const hideWhenVisible = { display: visible ? 'none' : '' }
        const showWhenVisible = { display: visible ? '' : 'none' }

        const toggleVisibility = () => {
            setVisible(!visible)
        }

        return (
            <div>
            <div style={hideWhenVisible}>
                <button onClick={toggleVisibility}>{props.buttonLabel}</button>
            </div>
            <div style={showWhenVisible}>
                {props.children}        <button onClick={toggleVisibility}>cancel</button>
            </div>
            </div>
        )
    }

    export default Togglable

Tämä mahdollistaa sen, että Togglablen sisälle laitetut lapset voidaan piilottaa, jonka seurauksesti voidaan luoda:

    <Togglable buttonLabel='login'>
        <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
        />
    </Togglable>

Huomaa Togglable komponentissa käytetty props.children, jonka avulla sen sisälle laitettavat komponentit on määritelty. Tämä on reactin automaattisesti määrittelemä aina olemassa oleva propsi, minkä takia automaattisesti suljetuilla tapauksilla props.children on tyhjä taulukko.

Jos nyt tarkastellaan sovelluksen tilaa, huomataan sen kokonaan olevan sijoitettu App:in, vaikka se ei tarvitse niitä mihinkään. Nämä tilat voidaan siirtää niitä vastaaviin komponenteihin, minkä seurauksesta muistiinpanon luomisesta huolehtiva komponentti muuttuu seuraavasti: 

    import { useState } from 'react' 

    const NoteForm = ({ createNote }) => {
        const [newNote, setNewNote] = useState('') 

        const handleChange = (event) => {
            setNewNote(event.target.value)
        }

        const addNote = (event) => {
            event.preventDefault()
            createNote({
            content: newNote,
            important: Math.random() > 0.5,
            })

            setNewNote('')
        }

        return (
            <div>
            <h2>Create a new note</h2>

            <form onSubmit={addNote}>
                <input
                value={newNote}
                onChange={handleChange}
                />
                <button type="submit">save</button>
            </form>
            </div>
        )
    }

    export default NoteForm

Nyt App voidaan muuttaa seuraavasti:

    <Togglable buttonLabel="new note">
        <NoteForm createNote={addNote} />      
    </Togglable>

Sovellusta voidaan edelleen parantaa hyödyntämällä reactin ref-mekanismia, joka mahdollistaa viittauksen komponenttiin. Muutetaan App tiedostoa seuraavasti:

import { useState, useEffect, useRef } from 'react'

    const App = () => {
        const noteFormRef = useRef()
        const noteForm = () => (
            <Togglable buttonLabel='new note' ref={noteFormRef}>      
                <NoteForm createNote={addNote} />
            </Togglable>
        )
    }

Nyt togglabe laajentuu seuraavasti:

    import { useState, useImperativeHandle, forwardRef } from 'react'
    
    const Togglable = forwardRef((props, ref) => {  
        const [visible, setVisible] = useState(false)

        const hideWhenVisible = { display: visible ? 'none' : '' }
        const showWhenVisible = { display: visible ? '' : 'none' }

        const toggleVisibility = () => {
            setVisible(!visible)
        }

        useImperativeHandle(ref, () => {    return {      toggleVisibility    }  })
            return (
                <div>
                <div style={hideWhenVisible}>
                    <button onClick={toggleVisibility}>{props.buttonLabel}</button>
                </div>
                <div style={showWhenVisible}>
                    {props.children}
                    <button onClick={toggleVisibility}>cancel</button>
                </div>
                </div>
        )
    })

    export default Togglable

Lisätään vielä App tiedostoon:

    const addNote = (noteObject) => {
        noteFormRef.current.toggleVisibility()    noteService
        .create(noteObject)
        .then(returnedNote => {     
            setNotes(notes.concat(returnedNote))
        })
    }

Huomaa vielä react komponetteihin liittyen, että tapauksessa 

    <div>
        <Togglable buttonLabel="1" ref={togglable1}>
            ensimmäinen
        </Togglable>

        <Togglable buttonLabel="2" ref={togglable2}>
            toinen
        </Togglable>

        <Togglable buttonLabel="3" ref={togglable3}>
            kolmas
        </Togglable>
    </div>

Syntyy kolme erillistä komponenttiolioa, joilla kaikilla oma tilansa. Huomaa myös se, että vaikka togglable olettaa propsin buttonlable olemassaolon, niin sovellus edelleen toimii ilman sitä. Tämä voidaan korjata hyödyntämällä komentoa npm install prop-types, jonka jälkeen buttonLable voidaan määritellä pakolliseki string-tyypin propsiksi seuraavasti:

    import PropTypes from 'prop-types'

    const Togglable = React.forwardRef((props, ref) => {
    // ..
    }

    Togglable.propTypes = {
        buttonLabel: PropTypes.string.isRequired
    }

Koodi edelleen toimii, mutta tämä varmistaa errorin näyttämisen asiaan liittyen. Puuttumisen lisäksi propsin tyyppi on tarkastelun alla, sillä sen ollessa väärä konsoliin tulee virheilmoitus.

Laitetaan vielä ESLint frontend:in. Create-react-app on asentanut ESLintin valmiiksi projektiin, joten on luotava sopiva konfiguraatio .eslintrc.js ja ajetaan komento npm install --save-dev eslint-plugin-jest turhien huomautusten poistamiseksi. Luodaan .eslintrc.js muodoltaan

    module.exports = {
        "env": {
            "browser": true,
            "es6": true,
            "jest/globals": true 
        },
        "extends": [ 
            "eslint:recommended",
            "plugin:react/recommended"
        ],
        "parserOptions": {
            "ecmaFeatures": {
                "jsx": true
            },
            "ecmaVersion": 2018,
            "sourceType": "module"
        },
        "plugins": [
            "react", "jest"
        ],
        "rules": {
            "indent": [
                "error",
                2  
            ],
            "linebreak-style": [
                "error",
                "unix"
            ],
            "quotes": [
                "error",
                "single"
            ],
            "semi": [
                "error",
                "never"
            ],
            "eqeqeq": "error",
            "no-trailing-spaces": "error",
            "object-curly-spacing": [
                "error", "always"
            ],
            "arrow-spacing": [
                "error", { "before": true, "after": true }
            ],
            "no-console": 0,
            "react/prop-types": 0,
            "react/react-in-jsx-scope": "off"
        },
        "settings": {
            "react": {
            "version": "detect"
            }
        }
    }

, luodaan tiedost .eslintignore sisällöllä

    node_modules
    build
    .eslintrc.js

ja luodaan npm skripti lintausta varten:

    "eslint": "eslint ."

Huomaa, että create-react-appilla on oletusarvoinen ESLint-konfiguraatio, joka korvattiin nyt kokonaan omalla konfiguraatiolla.

# React-sovellusten testaaminen

Tarkastellaan nyt, miten frontendia voidaan testata. Testit tehdään Jest-kirjastolla, joka on valmiiksi konfiguroitu Create React App:illa luotuihin projekteihin. Sen lisäksi tarvitaan apukirjasto React Testing Library, joten asennettaan kummatkin komennolla npm install --save-dev @testing-library/react @testing-library/jest-dom. Muokataan nyt sovelluksen komponenttia Note seuraavasti:

    const Note = ({ note, toggleImportance }) => {
        const label = note.important
            ? 'make not important'
            : 'make important'

        return (
            <li className='note'>      {note.content}
            <button onClick={toggleImportance}>{label}</button>
            </li>
        )
    }

Tehdään nyt testi tiedostoon src/components/Note.test.js, joka on muodoltaan:

    import React from 'react'
    import '@testing-library/jest-dom/extend-expect'
    import { render, screen } from '@testing-library/react'
    import Note from './Note'

    test('renders content', () => {
        const note = {
            content: 'Component testing is done with react-testing-library',
            important: true
        }

        render(<Note note={note} />)

        const element = screen.getByText('Component testing is done with react-testing-library')
        expect(element).toBeDefined()
    })

Huomaa, että tässä testissä komponentti renderöidään funktiolla render. Ne normaalisti renderöityvät DOM:in, mutta nyt käytetään screen oliota, josta haetaan sisältö metodin getByText avulla. Create React APP on konfiguroinut testit oletusarvoisestsi suorittamaan watch moodissa, eli npm test komennnon suorittamisen jälkeen konsoli jää odottamaan koodissa tapahtuvia muutoksia, joiden jälkeen testit suoritetaan automaattisesti ja jest alkaa taas odottamaan uusia muutoksia. Normaalisti voidaan ajaa komenolla CI=true npm test.

Reactissa on kaksi konventiota testien sijoittamisesti, eli samaan hakemistoon testattavan komponentin kanssa ja erillisessä hakemistostssa olevat testit. Huomaa, että tämä on mielipide asia, joten valinta on aina jonkun mielestä väärin. Tosin Create React App:in konfiguroidessa testit samaan hakemistoon, käytetään ensimmäistä tapaa.

React Testing library antaa monia tapoja komponentin sisällän tutkimiseen, minkä takia viimeisellä rivillä oleva expect on turha. Esim, jos haluamme etsiä testattavia komponentteja CSS-selektoreilla, niin se onnistuu seuraavasti container-olion metodilla querySelector:

    const { container } = render(<Note note={note} />)
    
    const div = container.querySelector('.note')  
    
    expect(div).toHaveTextContent(    
        'Component testing is done with react-testing-library'  
    )

Testeissä voi debugata screen olion metodilla debug, jolloin konsoliin tulostuu komponentin generoima HTML. Komponentista voidaan ottaa pienempikin osa, kuten screen.debug(element).

Testataksemme nappien toimintaa on asenetteva apukirjasto user-event komennolla npm install --save-dev @testing-library/user-event. Jos huomaan yhteensopivuus eroja, niin käytä komentoa npm install -D --exact jest-watch-typeahead@0.6.5. Testaus toimii seuraavasti:

    import React from 'react'
    import '@testing-library/jest-dom/extend-expect'
    import { render, screen } from '@testing-library/react'
    import userEvent from '@testing-library/user-event'import Note from './Note'

    // ...

    test('clicking the button calls event handler once', async () => {
        const note = {
            content: 'Component testing is done with react-testing-library',
            important: true
        }

        const mockHandler = jest.fn()

        render(
            <Note note={note} toggleImportance={mockHandler} />
        )

        const user = userEvent.setup()
        const button = screen.getByText('make not important')
        await user.click(button)

        expect(mockHandler.mock.calls).toHaveLength(1)
    })

Huomaa, että käytetään Jestin mock funktiota ja komponenttin kanssa vuorovaikuttaminen vaatii uuden session aloitusta, joka onnistuu userEvent olion setup metodilla. Testissä se etsii tekstin perusteella napin ja klikkaa sitä, joka onnistuu userEvent-olion metodin click avulla. Testi onnistuu, jos mock funktiota on kutsuttu täsmälleen kerran. Mock-oliot ja funktiot ovat valekomponentteja, joiden avulla korvataan komponenttien riippuvuuksia. Ne mahdollistavat syötteiden palautuksen, metodikutsujen lukumäärän ja parametrien tarkkailun.

Lomakkeita voidaan testata seuraavasti:

    import React from 'react'
    import { render, screen } from '@testing-library/react'
    import '@testing-library/jest-dom/extend-expect'
    import NoteForm from './NoteForm'
    import userEvent from '@testing-library/user-event'

    test('<NoteForm /> updates parent state and calls onSubmit', async () => {
        const user = userEvent.setup()
        const createNote = jest.fn()

        render(<NoteForm createNote={createNote} />)

        const input = screen.getByRole('textbox')
        const sendButton = screen.getByText('save')

        await user.type(input, 'testing a form...')
        await user.click(sendButton)

        expect(createNote.mock.calls).toHaveLength(1)
        expect(createNote.mock.calls[0][0].content).toBe('testing a form...')
    })

Huomaa, että jos lomakkeella on useita syöttökenttiä, niin const input = screen.getByRole('textbox') aiheuttaa virheen. Tämä voidaan korjata seuraavasti:

    const inputs = screen.getAllByRole('textbox')

    await user.type(inputs[0], 'testing a form...')

Syöttökentille myös yleensä lisätään placeholder, joka ohjaa käyttäjää kirjoittamaan syötekentään oikean arvon. Tätä voi hyödyntää apuna metodilla geByPlaceHolderText. Joustavimman tavan tosin antaa render metodin content kentän querySelector, joka mahollistaa komponenttien etsimisen mielivaltaisten CSS-selektorien avulla. 

Huomaa se, että jos HTML komponentti renderöisi tekstin tavalla

    Your awesome note: {note.content}

, niin testissä käytetty getByText ei löytäisi sitä. Se etsii ainoastaan parametrien tekstiä, eikä mitään muuta. Tämän takia on joko lisättävä { exact: false } tai käyttää metodia findByText. Viimeinen tapaus tosin palauttaa promisen. Myös metoid queryByText on käyttökelpoinen, vaikka se ei aiheuta poikkeusta, jos elementtiä ei löydy. Sitä voidaan nimittäin käyttää varmistamaan, että jokin asia ei renderöidy.

Testauskattavuus saadaan helposti selville komennolla CI=true npm test -- --coverage, joka tuo tulokset konsoliin ja primitiivisen HTML repostin hakemistoon coverage/lcov-report.





