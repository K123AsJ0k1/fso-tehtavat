# React-router

Palataan Reduxittoman Reactin pariin. Yleensä web-sovelluksissa on navigaatiopalkki, jonka kautta pääsee sen pääsivuun ja muihin merkityksensä mukaisiin sivuihin. Vanhassa koulukunnassa nämä sivun vaihdot tapahtuivat selaimen tehdessä HTTP GET pyynnön ja renderöidessä tätä uuttaa näkymää vastaavan HTML-koodin. Taas single page appeissa ollaan todellisuuudessa samalla sivulla, sillä selaimessa suoritettava JavaScript koodi luo illuusion eri sivuista, eli HTTP kutsuja tehdää ainoastaan datan hakemiseen. Tämä on helppo toteuttaa reactissa:

    import React, { useState }  from 'react'
    import ReactDOM from 'react-dom/client'

    const Home = () => (
        <div> <h2>TKTL notes app</h2> </div>
    )

    const Notes = () => (
        <div> <h2>Notes</h2> </div>
    )

    const Users = () => (
        <div> <h2>Users</h2> </div>
    )

    const App = () => {
    const [page, setPage] = useState('home')

    const  toPage = (page) => (event) => {
        event.preventDefault()
        setPage(page)
    }

    const content = () => {
        if (page === 'home') {
        return <Home />
        } else if (page === 'notes') {
        return <Notes />
        } else if (page === 'users') {
        return <Users />
        }
    }

    const padding = {
        padding: 5
    }

    return (
        <div>
            <div>
                <a href="" onClick={toPage('home')} style={padding}>
                home
                </a>
                <a href="" onClick={toPage('notes')} style={padding}>
                notes
                </a>
                <a href="" onClick={toPage('users')} style={padding}>
                users
                </a>
            </div>

            {content()}
        </div>
    )
    }

    ReactDOM.createRoot(document.getElementById('root')).render(<App />, document.getElementById('root'))

Tässä jokainen näkymä on toteutettu omana komponenttina ja tilassa page pidetään tieto siitä, mitä näkymää vastaava komponentti menupalkin alla näytetään. Se ei tosin ole optimnaalinen, sillä jokaisella näkymällä pitäisi olla oma osoite ja sovelluksen kasvaessa tämän kaltainen reitittäminen muuttuu turhan monimutkaiseksi. Nämä ongelmat voidaan ratkaista React Router kirjastolla, joka voidaan asentaa komennolla npm install react-router-dom. Sen avulla sovellus muuttuu seuraavasti:

    import {
        BrowserRouter as Router,
        Routes, Route, Link
    } from "react-router-dom"

    const App = () => {
        const padding = {
            padding: 5
        }

        return (
            <Router>
            <div>
                <Link style={padding} to="/">home</Link>
                <Link style={padding} to="/notes">notes</Link>
                <Link style={padding} to="/users">users</Link>
            </div>

            <Routes>
                <Route path="/notes" element={<Notes />} />
                <Route path="/users" element={<Users />} />
                <Route path="/" element={<Home />} />
            </Routes>

            <div>
                <i>Note app, Department of Computer Science 2022</i>
            </div>
            </Router>
        )
    }

Huomaa, että vaikka komponenttiin viitataan nimellä Router, niin kyseessä on BrowserRouter. HTML5 history API:n avulla URL voidaan käyttää react-sovelluksen sisäiseen reitittämiseen, eli sivun sisältö manipuloidaan ainoastaan java scriptillä ja selain ei lataa uutta sisältöä. Routerin sisällä likkejä määritellään seuraavasti:

    <Link to="/notes">notes</Link>

Taas selaimen URL perustuen renderöitävä komponentti määritellään seuraavasti:

    <Route path="/notes" element={<Notes />} />

Nämä voidaan sijoittaa Routes-komponentin lapsiksi:

    <Routes>
        <Route path="/notes" element={<Notes />} />
        <Route path="/users" element={<Users />} />
        <Route path="/" element={<Home />} />
    </Routes>

Reactissa routet voidaan parametrisoida. Klikattava lista voidaan luoda seuraavasti:

    const Notes = ({notes}) => (
        <div>
            <h2>Notes</h2>
            <ul>
            {notes.map(note =>
                <li key={note.id}>
                <Link to={`/notes/${note.id}`}>{note.content}</Link>
                </li>
            )}
            </ul>
        </div>
    )

Sen mukainen route on määriteltävä seuraavasti:

    <Route path="/notes/:id" element={<Note notes={notes} />} />

Se renderoidään seuraavan id:n avulla:

    const id = useParams().id

Tarkastellussa sovelluksessa käyttäjä näytetään seuraavasti:

    {user      
        ? <em>{user} logged in</em>      
        : <Link style={padding} to="/login">login</Link>    
    }

Siitä huolehtiva koodi on seuraava:

    const navigate = useNavigate()
    
    const onSubmit = (event) => {
        event.preventDefault()
        props.onLogin('mluukkai')
        navigate('/')  
    }

Huomaa, että navigate muuttaa selaimen osoitteen, minkä seurauksesta se tässä tapauksessa renderöi komponentin home. Kiinnostava detaili Users routeen 

    <Route path="/users" element={user ? <Users /> : <Navigate replace to="/login" />} />

on se, ettei kirjautumattomassa tilassa Usersia ei renderöidä, vaan sen sijaan käyttäjä uudelleenohjataan kirjautumisnäkymään. Nyt sovellus on kokonaisuudessaan: 

    const App = () => {
        const [notes, setNotes] = useState([
            // ...
        ])

        const [user, setUser] = useState(null) 

        const login = (user) => {
            setUser(user)
        }

        const padding = {
            padding: 5
        }

        return (
            <div>
            <Router>
            <div>
                <Link style={padding} to="/">home</Link>
                <Link style={padding} to="/notes">notes</Link>
                <Link style={padding} to="/users">users</Link>
                {user
                ? <em>{user} logged in</em>
                : <Link style={padding} to="/login">login</Link>
                }
            </div>

            <Routes>
                <Route path="/notes/:id" element={<Note notes={notes} />} />  
                <Route path="/notes" element={<Notes notes={notes} />} />   
                <Route path="/users" element={user ? <Users /> : <Navigate replace to="/login" />} />
                <Route path="/login" element={<Login onLogin={login} />} />
                <Route path="/" element={<Home />} />      
            </Routes>
            </Router>      
            <div>
                <br />
                <em>Note app, Department of Computer Science 2022</em>
            </div>
            </div>
        )
    }

Ikävä asia tässä sovelluksess aon se, että Note saa propseina kaikki muistiinpanot, mutta se näyttää ainoastaan id:tä vastaavan noten. Tämä voidaan korjata useMatchin avulla. Sen käyttö ei ole mahdollista samassa komponentissa, joka määrittellee sovelluksen reitityksen, joten siirrettään router komponentti App:n ulkopuolelle. App muuttu nyt seuraavasti:

    import {
    // ...
    useMatch} from "react-router-dom"

    const App = () => {
    // ...

        const match = useMatch('/notes/:id')  
        const note = match     
            ? notes.find(note => note.id === Number(match.params.id))    
            : null
        
        return (
            <div>
            <div>
                <Link style={padding} to="/">home</Link>
                // ...
            </div>

            <Routes>
                <Route path="/notes/:id" element={<Note note={note} />} />        <Route path="/notes" element={<Notes notes={notes} />} />   
                <Route path="/users" element={user ? <Users /> : <Navigate replace to="/login" />} />
                <Route path="/login" element={<Login onLogin={login} />} />
                <Route path="/" element={<Home />} />      
            </Routes>   

            <div>
                <em>Note app, Department of Computer Science 2022</em>
            </div>
            </div>
        )
    }    

Nyt haluttu note voidaan renderöidä komennolla:

    const match = useMatch('/notes/:id')

Jos URL on muotoa /notes/:id ja vastaa yksittäisen muistiinpanon URL:ia, niin muuttuja match saa arvokseen olion, jonka parametroitu osa id voidaan selvittää. Tämä voidaan tehdä seuraavasti:

    const note = match 
        ? notes.find(note => note.id === Number(match.params.id))
        : null

# Custom-hookit

React tarjoaa kymmenen erilaista valmista hookia, joista eniten käytetään useState ja useEffect. Hookit eivät ole mitä tahansa funktiota, vaan niitä on käytettävä tiettyjen sääntöjen mukaisesti, jotka ovat: Älä kutsu Hookeja loopeissa, ehdoissa tai rekusoirivssa funktioissa tai tavallisissa javascript funktioissa. Create React Appin valmiiksi asentama Eslint sääntöjä varoitta, jos hookeja käytetään väärin. React antaa mahddollisuuden myös omien custom-hookien luomiseen. Se mahdollistaa komponenttien logiikan uudelleenkäyttämisen.

Ne ovat tavallisia javascript funktiota, jotka voivat kutsua mitä tahansa muita hookeja sääntöjen puitteissa. Niiden nimien täytyy alkaa sanalla use. Esimerkki custom hookista on:

    const useCounter = () => {
        const [value, setValue] = useState(0)

        const increase = () => {
            setValue(value + 1)
        }

        const decrease = () => {
            setValue(value - 1)
        }

        const zero = () => {
            setValue(0)
        }

        return {
            value, 
            increase,
            decrease,
            zero
        }
    }

Sitä voidaan käyttää seuraavalla tavalla:

    const App = (props) => {
        const counter = useCounter()

        return (
            <div>
            <div>{counter.value}</div>
            <button onClick={counter.increase}>
                plus
            </button>
            <button onClick={counter.decrease}>
                minus
            </button>      
            <button onClick={counter.zero}>
                zero
            </button>
            </div>
        )
    }

Sitä voidaan uusiokäyttää seuraavasti:

    const App = () => {
        const left = useCounter()
        const right = useCounter()

        return (
            <div>
            {left.value}
            <button onClick={left.increase}>
                left
            </button>
            <button onClick={right.increase}>
                right
            </button>
            {right.value}
            </div>
        )
    }

Jos haluttaisiin helpottaa lomakkeen tilanhallintaa, niin voitaisiin luoda

    const useField = (type) => {
        const [value, setValue] = useState('')

        const onChange = (event) => {
            setValue(event.target.value)
        }

        return {
            type,
            value,
            onChange
        }
        }

, jolloin

    const App = () => {
        const name = useField('text')
        // ...

        return (
            <div>
            <form>
                <input
                type={name.type}
                value={name.value}
                onChange={name.onChange} 
                /> 
                // ...
            </form>
            </div>
        )
    }

Helpommalla voidaan tosin päästä hyödyntämllä spread-syntaksia seuraavasti:

    <input {...name} /> 

Tätä hyödyntäen propsien välitys helpottu seuraavasti:

    <Greeting firstName='Arto' lastName='Hellas' />

    const person = {
        firstName: 'Arto',
        lastName: 'Hellas'
    }

    <Greeting {...person} />

Custom hookit siis mahdollistavat tavan jakaa koodia modulaariisin osiin.