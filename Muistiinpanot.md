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

Syntyy kolme erillistä komponenttiolioa, joilla kaikilla oma tilansa.



