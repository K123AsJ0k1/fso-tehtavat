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

# Lisää tyyleistä

Yksi sovelluksen tyylien määrittelyyn on valmiin käyttöliittymäkirjaston käyttö. Yksi käyteytyin on twitterin kehittämä bootstrap, mutta niitä on niin paljon, ettei kaikkia tulla listamaan. Monet UI-frameworkit sisältävät web-sovelluksen käyttöön valmiiksi määriteltyjä teemoja ja "komponentteja" ,eli painikeitta, menuja ja taulukkoja. useimmiten UI-frameworkeja käytetään sisällyttämällä sovelluksen frameworkin määrittelemät CSS-tyylitiedostot sekä JavaScript koodi. Tarkastellaan nyt bootstrapia ja MaterialUI hyödyntämistä reactissa. 

Bootstrapin react versio voidaan asentaa komennolla npm install react-bootstrap. Sen jälkeen on asetettava tiedostoon public/index.html tagin head sisään bootstrapin css-määrittelyt lataava rivi:

    <head>
        <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
            integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
            crossorigin="anonymous"
        />
        // ...
    </head>

Bootstrapissa koko sivun sivun sisältö renderöitään yleensä containerina: eli käytännössä koko sovelluksen ympäröivä div-elementti merkitään luokalla container:

    return (
        <div className="container">      
            // ...
        </div>
    )

Jos halutan renderöidä muistiinpanojen listan taulukkona, niin bootstrap tarjoaa valmiin komponentin table:

    <div>
        <h2>Notes</h2>
        <Table striped>      
            <tbody>
                {notes.map(note =>
                    <tr key={note.id}>
                        <td>
                            <Link to={`/notes/${note.id}`}>
                                {note.content}
                            </Link>
                        </td>
                        <td>
                            {note.user}
                        </td>
                    </tr>
                )}
            </tbody>
        </Table>
    </div>

Huomaa, että bootstrap komponentit on importtava, joten on lisättävä:

    import { Table } from 'react-bootstrap'

Jos bootstrapilla halutaan luoda lomake, niin:

    import { Table, Form, Button } from 'react-bootstrap'

    <div>
        <h2>login</h2>
        <Form onSubmit={onSubmit}>
            <Form.Group>
                <Form.Label>username:</Form.Label>
                <Form.Control
                    type="text"
                    name="username"
                />
                <Form.Label>password:</Form.Label>
                <Form.Control
                    type="password"
                />
                <Button variant="primary" type="submit">
                    login
                </Button>
            </Form.Group>
        </Form>
    </div>   

Jos bootstrapilla halutaan luoda notifikatio, niin:

    {(message &&    
        <Alert variant="success">      
            {message}    
        </Alert>  
    )}

Jos bootstrapilla halutaan luoda navigaatiomenu, niin:

    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
            <Nav.Link href="#" as="span">
                <Link style={padding} to="/">home</Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
                <Link style={padding} to="/notes">notes</Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
                <Link style={padding} to="/users">users</Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
                {user
                ? <em>{user} logged in</em>
                : <Link to="/login">login</Link>
                }
            </Nav.Link>
            </Nav>
        </Navbar.Collapse>
    </Navbar>

Bootstrap ja valtaosa UI-frameworkeista tuottaa responisiivisa näkymiä, jotka renderöityvät vähintään kohtuullisesti eri kokoisilla näytöillä. Chrome developer konsoli mahdollistaa käyttämisen simuloimisen erilaisilla mobiilipäätteillä. Tarkastellaan seuraavaksi googlen kehittämä Material UI, joka asennettaan komennolla npm install @mui/material @emotion/react @emotion/styled. Nyt on vielä lisättävä tiedostoon public/index.html tagin head sisään:

    <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        // ...
    </head>

Jos Material UI halutaan containeri, niin:

    return (
        <Container>
        // ...
        </Container>
    )

Jos Material UI:ssa halutaan taulukko, niin:

    <div>
        <h2>Notes</h2>
        <TableContainer component={Paper}>
            <Table>
                <TableBody>
                {notes.map(note => (
                    <TableRow key={note.id}>
                    <TableCell>
                        <Link to={`/notes/${note.id}`}>{note.content}</Link>
                    </TableCell>
                    <TableCell>
                        {note.name}
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
    </div>

Ikävä puoli Material UI:ssa on se, että jokainen komponentti on importattava erikseen, joten importti lista on pitkä:

    import {
        Container,
        Table,
        TableBody,
        TableCell,
        TableContainer,
        TableRow,
        Paper,
    } from '@mui/material'

Jos halutaan lomake Material UI:lla, niin 

    const navigate = useNavigate()

    const onSubmit = (event) => {
        event.preventDefault()
        props.onLogin('mluukkai')
        navigate('/')
    }

    return (
        <div>
            <h2>login</h2>
            <form onSubmit={onSubmit}>
                <div>
                <TextField label="username" />
                </div>
                <div>
                <TextField  label="password" type='password' />
                </div>
                <div>
                <Button variant="contained" color="primary" type="submit">
                    login
                </Button>
                </div>
            </form>
        </div>
    )

Huomaa, ettei MaterialUI tarjoa erillistä komponenttia lomakkeelle, joten se on tehtävä normaaliin tapaan HTML:n form elementillä. Ne on myös importattava koodissa.

Jos Material UI:ssa halutaan notifikatio, niin:

    <div>
        {(message &&    
            <Alert severity="success">      
                {message}    
            </Alert>  
        )}
    </div>

Jos Material UI:ssa halutaan navigaatiorakenne, niin:

    <AppBar position="static">
        <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu">
            </IconButton>
            <Button color="inherit">
                <Link to="/">home</Link>
            </Button>
            <Button color="inherit">
                <Link to="/notes">notes</Link>
            </Button>
            <Button color="inherit">
                <Link to="/users">users</Link>
            </Button>  
            <Button color="inherit">
            {user
                ? <em>{user} logged in</em>
                : <Link to="/login">login</Link>
            }
            </Button>                
        </Toolbar>
    </AppBar>

Parempi tapa on tosin:

    <AppBar position="static">
        <Toolbar>
            <Button color="inherit" component={Link} to="/">
            home
            </Button>
            <Button color="inherit" component={Link} to="/notes">
            notes
            </Button>
            <Button color="inherit" component={Link} to="/users">
            users
            </Button>   
            {user
            ? <em>{user} logged in</em>
            : <Button color="inherit" component={Link} to="/login">
                login
                </Button>
            }                              
        </Toolbar>
    </AppBar>

Huomaa, että tarjottaiven UI-frameworkien ikävä puoli on React API:n mahdollinen epästabiliisuus ja osittain huon dokumentaatio.

Erilainen tapa tuoda tyylejä Reactiin on ES6 tagged template literal syntaksia hyödyntävä styled components kirjasto, joka voidaan asentaa komennolla npm install --save styled-components. Tällä kirjastolla button ja input voidaan tyylittää seuraavasti:

    import styled from 'styled-components'

    const Button = styled.button`
        background: Bisque;
        font-size: 1em;
        margin: 1em;
        padding: 0.25em 1em;
        border: 2px solid Chocolate;
        border-radius: 3px;
    `

    const Input = styled.input`
        margin: 0.25em;
    `

Näitä käytetään normalisti, joten 

    return (
        <div>
            <h2>login</h2>
            <form onSubmit={onSubmit}>
                <div>
                username:
                <Input />        </div>
                <div>
                password:
                <Input type='password' />        </div>
                <Button type="submit" primary=''>login</Button>      
            </form>
        </div>
    )

Nyt määrittelemällä hieman lisää

    const Page = styled.div`
        padding: 1em;
        background: papayawhip;
    `

    const Navigation = styled.div`
        background: BurlyWood;
        padding: 1em;
    `

    const Footer = styled.div`
        background: Chocolate;
        padding: 1em;
        margin-top: 1em;
    `

, voidaan luoda:

    return (
        <Page>      
            <Navigation>        
            <Link style={padding} to="/">home</Link>
            <Link style={padding} to="/notes">notes</Link>
            <Link style={padding} to="/users">users</Link>
            {user
            ? <em>{user} logged in</em>
            : <Link style={padding} to="/login">login</Link>
            }
        </Navigation>
        
            <Switch>
                <Route path="/notes/:id">
                    <Note note={note} />
                </Route>
                <Route path="/notes">
                    <Notes notes={notes} />
                </Route>
                <Route path="/users">
                    {user ? <Users /> : <Redirect to="/login" />}
                </Route>
                <Route path="/login">
                    <Login onLogin={login} />
                </Route>
                <Route path="/">
                    <Home />
                </Route>
            </Switch>
        
            <Footer>        
            <em>Note app, Department of Computer Science 2020</em>
            </Footer>    
        </Page>  
    )

Tämä tyylitys muoto on nousu suosiossaan ja se on monen mielestä paras tapa React-sovellusten tyylittämiseen.

# Webpack

Tarkastellaan mitä create-react-appin piilottaa taustalle. Avainasemassa on webpack työkälu. Moduuleissa oleva koodi bundaltaan selainta varten, eli siitä muodostetaan yksittäinen kaiken koodin sisältävä tiedosto. Tämä bundalus suoritetaan komennolla npm run build, eli npm skripti suorittaa sen webpackia hyväksi käyttäen. Tuloksena on joukko hakemistoon build sijoitettavia tiedostoja. Tämän hakemiston juuressa index.html lataa script tagin avulla bundlatun javascript tiedoston:

    <!doctype html>
    <html lang="en">
        <head>
            <meta charset="utf-8"/>
            <title>React App</title>
            <script defer="defer" src="/static/js/main.88d3369d.js"></script> 
            <link href="/static/css/main.1becb9f2.css" rel="stylesheet">
        </head>
        <div id="root"></div>
        </body>
    </html>

Huomataan siis, että sovelluksen javascriptille määritellään alkupiste ja webpack ottaa mukaan kaiken koodin mitä alkupiste importtaa, sekä importtaujen koodien importtamat koodit. Tarkastellaan nyt react projektin webpacking konfigurioimista kokonaan käsin. Hakemisto rakenne on:

- build
- package.json
- src 
  - index.js
- webpack.config.js

Tässä package.json sisältä voi olla:

    {
        "name": "webpack-osa7",
        "version": "0.0.1",
        "description": "practising webpack",
        "scripts": {},
        "license": "MIT"
    }

Webpack voidaan asentaa komennolla npm install --save-dev webpack webpack-cli. Nyt webpack.config.js on seuraava:

    const path = require('path')

    const config = {
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: 'main.js'
        }
    }

    module.exports = config

Luodaan nyt skiripti sen luomsieen:

    "scripts": {
        "build": "webpack --mode=development"
    },

Nyt voidaan lisätä src hakemistoon App.js, jonka sisältö on:

const App = () => {
  return null
}

export default App

Taas Index.js tiedosto on muodoltaan:

    import App from './App';

    const hello = name => {
        console.log(`hello ${name}`)
    }

    App()

Nyt ajamalla npm run build tulostuu hyvin kryptinen sarja, jonka lopusta löytyy koodimme. Sovellus voidana luoda minimalistiseksi React-sovellukseksi asentamalla tarvitut kirjastot npm install react react-dom. Index.js muuttuu nyt muotoon:

    import React from 'react'
    import ReactDOM from 'react-dom/client'
    import App from './App'

    ReactDOM.createRoot(document.getElementById('root')).render(<App />, document.getElementById('root'))

Taas App.js muuttuu muotoon:

    import React from 'react' // tarvitsemme importin nyt myös kompontentin määrittelyn yhteydessä

    const App = () => {
        return (
            <div>
            hello webpack
            </div>
        )
    }

    export default App

Ennen uudelleen käynnistämistä tarvitaan loaderi, joka saadaan sijoittamalla:

    const config = {
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: 'main.js',
        },
        module: {    
            rules: [      
                {        
                    test: /\.js$/,        
                    loader: 'babel-loader',        
                    options: {          
                        presets: ['@babel/preset-react'],        
                    },      
                },    
            ],  
        },
    }

Tämän jälkeen loader asennettaan komennolla npm install @babel/core babel-loader @babel/preset-react --save-dev. Asennettana vielä npm install core-js regenerator-runtime, jotka importataan:

    import 'core-js/stable/index.js'
    import 'regenerator-runtime/runtime.js'

Otetaan käyttöön @bable/preset-env komennolla npm install @babel/preset-env --save-dev ja muuttamalla:

    options: {
        presets: ['@babel/preset-env', '@babel/preset-react']  
    }

Jos haluamme ottaa CSS:n käyttöön, niin tarvitaan ja

    {      
        test: /\.css$/,      
        use: ['style-loader', 'css-loader'],    
    },

komennon npm install style-loader css-loader --save-dev ajaminen. Nyt sovelluskehitys onnistuu, mutta workflow on hirveää, joten asennettaan npm install --save-dev webpack-dev-server, määritellään skripti "start": "webpack serve --mode=development" ja lisätään tiedostoon webpack.config.js kenttä devServer:

    devServer: {    
        static: path.resolve(__dirname, 'build'),    
        compress: true,    
        port: 3000,  
    },

Nyt sovelluskehitys on normaalilla tasolla. Virheilmoitukset eivät tosin näy,joten lisätään source-map. Tämä tapahtuu lisäämällä devtool: 'source-map' konfiguraatioon. 

Kun sovellus viedään tuotantoon, on tiedoston koolla väliä. Tätä voi korjata koodin minifoinnilla, joista alaa johtava työkalu on UglifyJS. Tämä voidana lisätä muuttamalla "build": "webpack --mode=production".

Jos haluamme lisätä backendin, niin webpackin DefinePlugin avulla voidaan luoda globaaleja vakioarvoja, joita käytetään bundlatussa koodissa:

    const path = require('path')
    const webpack = require('webpack')
    
    const config = (env, argv) => {
        console.log('argv', argv.mode)

        const backend_url = argv.mode === 'production'    
            ? 'https://obscure-harbor-49797.herokuapp.com/api/notes'    
            : 'http://localhost:3001/notes'

        return {
            entry: './src/index.js',
            output: {
                path: path.resolve(__dirname, 'build'),
                filename: 'main.js'
            },
            devServer: {
                static: path.resolve(__dirname, 'build'),
                compress: true,
                port: 3000,
            },
            devtool: 'source-map',
            module: {
            // ...
            },
            plugins: [      
                new webpack.DefinePlugin({        
                    BACKEND_URL: JSON.stringify(backend_url)      
                })    
            ]  
        }
    }

    module.exports = config

Nyt niitä voidaan käyttää koodissa seuraavasti:

    const App = () => {
        const [counter, setCounter] = useState(0)
        const [values, setValues] = useState([])
        const notes = useNotes(BACKEND_URL)
        // ...
        return (
            <div className="container">
                hello webpack {counter} clicks
                <button onClick={handleClick} >press</button>
            <div>{notes.length} notes on server {BACKEND_URL}</div>    </div>
        )
    }

Viimeiseksi, jos peruskonfiguraatio ei riitä, niin projekti voidaan ejektoida, jolloin magia häviää ja konfiguraatiot tallettuvat hakemistoon config ja muokattuun package.json tiedostoon. Huomaa, että tämän jälkeen ei ole paluuta, sillä konfiguraatiosta on huolehdittava itse. Ne eivät ole triviaaleimmasta päästä ja sen tekemisen sijasta parhain vaihtoehto saattaa joskus olla tehdä itse koko webpack konfiguraatio. Niiden lukeminen on tosin suositeltavaa ja hyvin opettavaista.

# Luokkakomponentit, sekalaista

Tällä kurssilla on käytetty ainoastaan JavaScript funktiona määritelty React-komponetteja. Tämä ei ollut mahdollista ennen Reactin versiossa 16.8 tullutta hook-toiminnallisuutta. Class, eli luokkakomponentti on syytä tuntea, sillä maailmassa on suuri määrä vanhaa React-koodia, mitä ei koskaan tulla kokonaisuudessaan refaktoroimaan uudella syntaksilla. Tarkastellaan nyt sen tärkeimpiä ominaisuuksia anekdoottisovelluksen toteuttamisen avulla. Sen luokkakomponentin ensimmäinen versio näyttää seuraavalta:

    import React from 'react'

    class App extends React.Component {
        constructor(props) {
            super(props)
        }

        render() {
            return (
            <div>
                <h1>anecdote of the day</h1>
            </div>
            )
        }
    }

    export default App

Komponentilla on siis konstruktori ja render, joka määrittelee renderöitymisen. Komponenttit tilat voidaan määritellä seuraavasti:

    constructor(props) {
        super(props)

        this.state = {      
            anecdotes: [],      
            current: 0    
        }  
    }

Komponenteille oikea paikka hakea palvelimella olevaa dataa ovat effect hookit, jotka tarjoavat elinkaarimetodit, kuten componentDidMount:

    componentDidMount = () => {    
        axios.get('http://localhost:3001/anecdotes').then(response => {      
            this.setState({ anecdotes: response.data })    
            })  
    }

Lisätään vielä ominaisuus, että näytettävä anekdootti on mahdollista vaihtaa:

    handleClick = () => {    
        const current = Math.floor(      
            Math.random() * (this.state.anecdotes.length - 1)    
        )    
        this.setState({ current })  
    }

    return (
        <div>
            <h1>anecdote of the day</h1>
            <div>{this.state.anecdotes[this.state.current].content}</div>
            <button onClick={this.handleClick}>next</button>      
        </div>
    )

Merkittävä etu funktionaalisten komponenttien käytössä on se, että paljon harmia tuottavaa this-viitettä ei tarvitse käsitellä ollenkaan. Tämän takia suuren enemmistön mielestä luokkakomponenteilla ei ole mitään etuja niihin verrattuna paitsi error boundry mekanismin tapauksessa, jota ei ole vielä niiden käytössä. Ei siis ole olemassa mitään rationaalista syytä luokkakomponenttien käyttämiseen, ellei kyse ole vanhasta Reactista.

Liittyen koodin organisoimiseen, yhtä hopea luotia ei ole, vaan asiaa on mietittävä tarpeen mukaisesti. Taas front ja backend sijoitus ratkaisut ovat hieman tilanteen mukaisia, sillä vaikka niiden sijoittaminen erillisiin repoihin on tyyppillinen ratkaisu, voi olla tilanteita niiden yhteiseen repoon. 

Liittyen frontin ja backin synkronisoimiseen, yksi tapa päivittää front backin tiedoista on käyttää pollausta, eli toistuvia kyselyistä backendin setInterval komennolla. Edistyneempi tapa on WebSocket, joka mahdollistaa kaksisuuntaisen kommunikaation, jolloin frontendin ei tarvitse pollata backendia, vaan riittää määritellä tilanteita, joissa palvelin lähettää websocketin avulla tietoja tilan päivittämiseen. WebSocketin API:n suoran käyttämisen sijasta on suositeltavaa käyttää Socket.io kirjasstoa, joka tarjoaa fallback ominaisuuksia.

Liittyen virtual DOM:in, sen määrittelevät sovelluksen react elementit, joita pidetään keskusmuistissa. ReactDOM kirjaston avulla komponenttien määrittelevä virtuaalinen DOM renderöidään oikeaksi DOM:iksi, eli DOM API:n avulla selaimen näytettäväksi. Kun sovelluksen tila muuttuu, määrittyy komponenttien renderöinnin takia uusi virtuaalinen DOM. Reactilla on edellinen versio DOM:ista, mutta sen poistamissen sijaan React muuttaa sen optimaallisesti uudeksi versioksi.

Lopuksi, React on ensisijaisesti näkymien luomiseksi huolehtiva kirjasto, minkä takia sitä ei kutsuta sovelluskehykseksi. Koska react ja flux ovat facebookin tekeleitä, niin raectin pitäminen ainoastaan käyttöliittymästä huolehtivana kirjastona on oikeaoppista käyttöä. Taas flux arkkitehtuurin noudatus tuo overheadin, niin reactin väärinkäyttäminen voi olla järkevää, sillä overengineeri ei yleensä johda optimaalliseen tulokseen.

Vielä, tällä kurssilla ei ole mainittu paljoakaan tietoturvaan liittyen. Listan ykkösenä on injektio, jossa lomakkeen avulla lähetettävä teksti tulkitaan aivan eri tavalla kuin sovelluskehittäjä on tarkoittanut, joista kuuluisin on SQL-injektio. Nämä estetään parametrisoidulla kyselyillä. Toinen on XSS hyökkäys, jossa injektoidaan vihamielistä JavaScript koodia. React yleensä huolehtii näistä, mutta mikään ei takaa, etteikö aukkoja löydy.

Huomaa, että riippuvuuksien ajantasaisuuden voi tarkastaa komennolla npm outdated --depth 0 ja ne saa päivitettyä komennolla npm install -g npm-check-updates. Tiedosto package.sjon päivitetään komennolla ncu -u, jonka jälkeen riippuvuuden ajantasaistetaan komennolla npm install. Taas npm audit antaa pitkän listan valituksia ja korjausehdotuksia. Tämän mukainen korjaus voidaan tehdä audit fix avulla. Tärkein oppi on se, ettei koskaan saa luottaa selaimen antamaan dataan.

---
