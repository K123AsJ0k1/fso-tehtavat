# Flux-arkkitehtuuri ja Redux

Olemme määritteleet komponenttien tilat ja metodit sovelluksen juurikomponentissa, mutta sovelluksen kasvaessa tämä muuttuu haasteelliseksi. Ratkaisu tähän on flux-arkkitehtuuri, jossa sovelluksen tilan hallinta erotetaan kokonaan komponenttien ulkopuolisiin varashoitin, eli storeihin. Storessa olevaa tilaa ei muuteta suoraan, vaan tapahtumien eli actionien avulla. Actionin muuttaessa storen tilaa näkymät renderöidään ja sovelluksen käytön vaatimat muutokset tehdään actionieni avulla, eli renderöityminen tapahtuu.

Tulemme käyttämään redux-kirjastoa flux:in toteuttamiseksi, joten tutustutaan siihen laskuri sovelluksen avulla. Redux voidaan asentaa komennolla npm install redux. Reduxissa sovelluksen tila talletetaan storeen, mutta sovelluksen kannalta ainoastaan yhteen storen tallentamaan JavaScript-objektiin. Monimutkaisemmassa tilanteessa eri asiat voitaisiin tallentaa storessa olevaan olioon erillisinä kenttinä. Storeja muutetaan actionien avulla, jotka ovat oliota, joilla on vähintään tyypin määrittelevä kenttä type, kuten:

    {
        type: 'INCREMENT'
    }

Huomaa, että actioneihin liittyessä dataa niihin määritellään muitakin kenttiä, mutta nyt tarvitaan ainoastaan tyyppikenttä. Actionien vaikutus määritellään reducerin avulla, joka on funktio, jonka parametrit ovat staten nykyisen tilan, actionin ja joka palautta staten uuden tilan. Sovelluksen reducer voisi olla:

    const counterReducer = (state, action) => {
        if (action.type === 'INCREMENT') {
            return state + 1
        } else if (action.type === 'DECREMENT') {
            return state - 1
        } else if (action.type === 'ZERO') {
            return 0
        }

        return state
    }

Huomaa, että reducereissa on tapana if:n sijasta käyttää switch-komentoa, joten määritellään state oletusarvoksi 0 ja korjataan se muotoon:

    const counterReducer = (state = 0, action) => {
        switch (action.type) {
            case 'INCREMENT':
                return state + 1
            case 'DECREMENT':
                return state - 1
            case 'ZERO':
                return 0
            default: // jos ei mikään ylläolevista tullaan tänne
            return state
        }
    }

Reducereita ei ole tarkoitus koskaan kutsua sovelluksen koodissa, joten se annetaan parametrinea storen luovalle createStore-funktiolle:

    import { createStore } from 'redux'

    const counterReducer = (state = 0, action) => {
    // ...
    }

    const store = createStore(counterReducer)

Nyt store käyttää reduceria käsitelläkseen actioneja, jotka lähetetään storelle dispatch-methodilla, kuten store.dispatch({type: 'INCREMENT'}). Storen tila saadaan selville metodilla getState. Kolmas tärkeä metodi on subscribe, jonka avulla voidaan määritellä takaisinkutsufunktiota, joita store kutsuu sen tilan muuttumisen yhteydessä, kuten:

    store.subscribe(() => {
        const storeNow = store.getState()
        console.log(storeNow)
    })

Nyt laskuri sovellus voisi olla kokonaisuudessaan muodoltaan:

    import React from 'react'
    import ReactDOM from 'react-dom/client'

    import { createStore } from 'redux'

    const counterReducer = (state = 0, action) => {
        switch (action.type) {
            case 'INCREMENT':
                return state + 1
            case 'DECREMENT':
                return state - 1
            case 'ZERO':
                return 0
            default:
                return state
        }
    }

    const store = createStore(counterReducer)

    const App = () => {
        return (
            <div>
            <div>
                {store.getState()}
            </div>
            <button 
                onClick={e => store.dispatch({ type: 'INCREMENT' })}
            >
                plus
            </button>
            <button
                onClick={e => store.dispatch({ type: 'DECREMENT' })}
            >
                minus
            </button>
            <button 
                onClick={e => store.dispatch({ type: 'ZERO' })}
            >
                zero
            </button>
            </div>
        )
    }

    const renderApp = () => {
        ReactDOM.createRoot(document.getElementById('root')).render(<App />)
    }

    renderApp()
    store.subscribe(renderApp)

Huomaa, että tässä App renderöi laskurin arvon kysymällä sitä storesta metodilla store.getState() ja React ei osaa automaattisesti renderöidä sovellusta uudelleen storen tilan arvon muuttuessa, minkä takia renderApp kuuntelee storen muutoksia metodilla store.subscribe ja se on jouduttu kutsumaan heti alussa metodia renderApp ensimmäisen renderöinnin tapahtumiseksi.

Redux olettaa, että reducerit ovat puhtaita funktioita, eli ne ivät aiheuta mitään sivuvaikutuksia ja palauttavat aina saman vastauksen samoilla parametreilla. Tämän takia tapaus state.push(action.data) ei ole sallittu, minkä takia on ensiki luotava uusi taulukko, jonka sisältönä on vanhan taulukon alkiot ja lisättävä alkio. Reducen tilan tulee koostua muuttumattomista immutable olioista, joten vanhat oliot korvataan uudella oliolla.

Varmistaaksemme reducereiden oikeanoppisen kirjoituksen, asennettaan kirjasto deep-freeze komennolla npm install --save-dev deep-freeze. Sen komento deepFreeze(state) varmistaa, että reducer ei muuta parametrina olevaa store tilaa. On suositeltavaa luoda testit ennen koodin refaktorointia redux muotoon. On suositeltavaa huomioda myös array spread syntaksi, jossa: 

    const luvut = [1, 2, 3]
    [...luvut, 4, 5] //[1, 2, 3, 4, 5]
    [luvut, 4, 5] // [[1,2,3], 4, 5]
    
ja 

    const luvut = [1, 2, 3, 4, 5, 6]

    const [eka, toka, ...loput] = luvut

    console.log(eka)    // tulostuu 1
    console.log(toka)   // tulostuu 2
    console.log(loput)  // tulostuu [3, 4, 5, 6]

Jos halutaan luoda lomakkeita reduxilla, niin on luotava ei-kontrolloitu lomake. Nämä omistavat tiettyjä rajoitteita. Ne eivät mahdollista lennossa annettavia validointi viestejä, lähetysnapin disabloimista sisällön perusteella ja etc. Lomakkeen funktio voisi olla muodoltaan:

    addNote = (event) => {
        event.preventDefault()
        const content = event.target.note.value  
        event.target.note.value = ''
        store.dispatch({
            type: 'NEW_NOTE',
            data: {
            content,
            important: false,
            id: generateId()
            }
        })
    }

Tässä on huomattava, että syötekentällä on oltava nimi, jotta sen arvon on mahdollista päästä käsiksi. Taas tärkeyden muuttamiseen käsittelijä on yksinkertainen:

    toggleImportance = (id) => {
        store.dispatch({
            type: 'TOGGLE_IMPORTANCE',
            data: { id }
        })
    }

Actioneita luovia funktioita kutsutaan action creatoreiksi, joiden avulla App voidaan yksinkertaistaa muotoon:

    const addNote = (event) => {
        event.preventDefault()
        const content = event.target.note.value
        event.target.note.value = ''
        store.dispatch(createNote(content))  
    }
  
    const toggleImportance = (id) => {
        store.dispatch(toggleImportanceOf(id))  
    }

Jos sovellus tulee monimutkaiseksi, niin voidaan Redux-store sovelluksen komponenteille välittää tarvittavat tiedot usealla tavalla. Uusin ja helpoin tapa on react-redux-kirjaston hooks-rajapinta, joka voidaan asentaa komennolla npm install react-redux. Uutta tässä on Provider komponentti ja storen siirtäminen providerin attribuutiksi. Huomaa, että moduulilla voi olla vain yksi default export, mutta usseita normaaleja exporteja, nyt store.dispatch tapahtuu useDispatch avulla ja tietoihin päästään käsiksi useSelectorilla.

Vielä viimeiseksi, komponentti

    const Note = ({ note, handleClick }) => {
        return(
            <li onClick={handleClick}>
            {note.content} 
            <strong> {note.important ? 'important' : ''}</strong>
            </li>
        )
    }

on nimeltään presentational komponentti ja komponentti

    const Notes = () => {
        const dispatch = useDispatch()  const notes = useSelector(state => state)
        return(
            <ul>
            {notes.map(note =>
                <Note
                key={note.id}
                note={note}
                handleClick={() => 
                    dispatch(toggleImportanceOf(note.id))
                }
                />
            )}
            </ul>
        )
    }

on nimeltään container komponentti. Presentationalit ovat siis yksinkertaisia entiteettejä ja containerit taas sisältävät niitä ja sovelluslogiikan.

# Monta reduseria

Jos haluamme lisätä tarkasteltuun sovellukseen tärkeyden, niin hyvä ratkaisu on

    const filterReducer = (state = 'ALL', action) => {
        switch (action.type) {
            case 'SET_FILTER':
            return action.filter
            default:
            return state
        }
    }

, jossa filtterin arvon asettavat actionit ovat muotoa:

    {
        type: 'SET_FILTER',
        filter: 'IMPORTANT'
    }

Tämän lisäksi määritellään action creator funktio:

    export const filterChange = filter => {
        return {
            type: 'SET_FILTER',
            filter,
        }
    }

Nyt voidaan luoda yhdistetty reducer tiedosstossa index.js:

    import React from 'react'
    import ReactDOM from 'react-dom/client'
    import { createStore, combineReducers } from 'redux'import { Provider } from 'react-redux' 
    import App from './App'

    import noteReducer from './reducers/noteReducer'
    import filterReducer from './reducers/filterReducer'
    
    const reducer = combineReducers({  
        notes: noteReducer,  
        filter: filterReducer
    })
    
    const store = createStore(reducer)

    console.log(store.getState())

    ReactDOM.createRoot(document.getElementById('root')).render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.getElementById('root')
    )

Huomaa, että yhdistetty reducer toimii siten, että jokainen action käsitellään kaikissa yhdistetyn reducerin osissa. Tämän takia on mahdollista luoda tilanteita, joita käsittelevät useampi reducer. Tässä on vielä muutettava notes muotoon const notes = useSelector(state => state.notes). Eriytyteetään vielä filtteri omaksi komponentiksi seuraavasti:

    import { filterChange } from '../reducers/filterReducer'
    import { useDispatch } from 'react-redux'

    const VisibilityFilter = (props) => {
        const dispatch = useDispatch()

        return (
            <div>
            all    
            <input 
                type="radio" 
                name="filter" 
                onChange={() => dispatch(filterChange('ALL'))}
            />
            important   
            <input
                type="radio"
                name="filter"
                onChange={() => dispatch(filterChange('IMPORTANT'))}
            />
            nonimportant 
            <input
                type="radio"
                name="filter"
                onChange={() => dispatch(filterChange('NONIMPORTANT'))}
            />
            </div>
        )
    }

    export default VisibilityFilter

Nyt on enää komponenttia notes muutettava seuraavasti:

  const notes = useSelector(state => {    
    if ( state.filter === 'ALL' ) {      
        return state.notes    
    }    
    return state.filter  === 'IMPORTANT'       
        ? state.notes.filter(note => note.important)      
        : state.notes.filter(note => !note.important)  
    })

Nyt on nähty, kuinka reduxin konfigurkointi ja tilanhallinta vaatii melko paljon vaivannäköä, kuten reducereiden ja action creatorien toisteisessa koodissa. Ratkaisu tähän on Redux Toolkit kirjasto, joka yksinkertaistaa huomattavasti redux-storen luontia ja tarjoaa merkittävästi tilanhallintaa helpottavia työkaluja. Se voidaan asentaa komennolla npm install @reduxjs/toolkit. Sovelluksen index.js voidaan muuttaa muotoon:

    import React from 'react'
    import ReactDOM from 'react-dom/client'
    import { Provider } from 'react-redux'
    import { configureStore } from '@reduxjs/toolkit'import App from './App'

    import noteReducer from './reducers/noteReducer'
    import filterReducer from './reducers/filterReducer'

    const store = configureStore({ 
         reducer: {    
            notes: noteReducer,    
            filter: filterReducer  
        }
    })

Nyt reducerit ja action creatorit voidaan luoda createSlice funktiolla seuraavasti:

    import { createSlice } from '@reduxjs/toolkit'

    const noteSlice = createSlice({  
        name: 'notes',  
        initialState,  
        reducers: {    
            createNote(state, action) {      
                const content = action.payload      
                state.push({        
                    content,       
                    important: false,        
                    id: generateId(),      
                    })    
                },    
                toggleImportanceOf(state, action) {      
                    const id = action.payload      
                    const noteToChange = state.find(n => n.id === id)      
                    const changedNote = {         
                        ...noteToChange,         
                        important: !noteToChange.important       
                    }      
                    return state.map(note =>        
                        note.id !== id ? note : changedNote       
                    )         
                }  
            },
        }) 

Tässä parametri name määrittelee etuliitteen, jota käytetään actioneiden type-arvoissa. Parametrin arvona on hyvä käyttää muiden reducereiden kesken uniikkia nimeä, jotta type-arvoissa ei tapahtuisi yhteentörmäyksiä. Parametri initialState alustaa tilan. Parametri reducers määrittelee reducerin objetkina, jonka funktiot käsittelevät tietyn actionin aiheuttamat tilamuutokset. Huomaa, että funktiossa action.payload on action creatorin kutsutta annettu argumentti.

Huomaa, että tässä käytetään staten sijasta push metodia. Redux Toolkit käyttää createSlice funktion määrittelyssä Immer kirjastoa, joka mahdollistaa state-argumentin mutatoinnin. Se muodostaa mutatoidun tilan perusteella uuden immutable tilan, joten tilamuutosen immutabiliteetti säilyy. Tila voidaan myös muuttaa toggleImportanceOf tavalla, mutta mutatointi on hyödyllinen monimutkaisen tilan päivityksessä. Reducer on palautetussa objektissa noteSlice.reducer, joten:

    export const { createNote, toggleImportanceOf } = noteSlice.actions
    export default noteSlice.reducer

Chromen on asennettavissa Redux DevTools, jonka avulla storen tilaa ja sen actioneita voidaan seurata selaimen konsolista. Redux Toolkitin configureStore funktion avulla luodusssa storessa tämä on automaattisesti käytössä ilman ylimääräistä konfiguraatiota. Ajaessasi sovellusta aukaise vain konsoli devtoolsien käyttöön. 

# Redux-sovelluksen kommunikointi palvelimen kanssa

Luodaan nyt sovellukselle kyky hyödyntää muistiinpanoja tallentavaa backendia. Tehdään tämä hyödyntämällä ennestään tuttua JSON serveriä. Luodaan ensiksi projektin juureen tiedostoon db.json muodoltaan:

    {
        "notes": [
            {
            "content": "the app state is in redux store",
            "important": true,
            "id": 1
            },
            {
            "content": "state changes are made with actions",
            "important": false,
            "id": 2
            }
        ]
    }

Projektiin voidaan asentaa JSON Server komennolla npm install json-server --save-dev, jonka jälkeen lisätään tiedostoon package.json osaan scripts rivi "server": "json-server -p3001 --watch db.json". Nyt JSON server voidaan käynnistää komennolla npm run server. Luodaan nyt tuttuun tapaan axioksin avulla backendistä dataa hakeva metodi tiedosto services/notes.js:

    import axios from 'axios'

    const baseUrl = 'http://localhost:3001/notes'

    const getAll = async () => {
        const response = await axios.get(baseUrl)
        return response.data
    }

    export default { getAll }

Muista, että axios voidaan asentaa projektiin komennolla npm installa axios. Muutetaan nyt noteReducerin tilan alustus siten, että oletusarvoisesti muistiinpanoja ei ole, eli initialState: []. Lisätään vielä uusia action muistiinpano-objektin lisäämiseksi:

    appendNote(state, action) {      
        state.push(action.payload)    
    }

Nopea tapa saada storen tila alustettua palvelimella olevaan dataan perusteella on hakea muistiinpanot tiedostossa index.js ja dispatchata niille yksitellen:

    noteService.getAll().then(notes =>  
        notes.forEach(note => {    
            store.dispatch(appendNote(note))  
        })
    )

Tämä tosin voidaan korvata lisäämällä actioni:

    setNotes(state, action) {      
        return action.payload    
    }

Huomaa, että tässä awaitin sijasta käytettiin promiseja ja then metodia siksi, että await toimii ainoastaan async funktioiden sisällä. Siirrettään nyt tämä koodi App seuraavasti:

    const dispatch = useDispatch()
    useEffect(() => {    
        noteService      
            .getAll().then(notes => dispatch(setNotes(notes)))  
    }, [dispatch])

Laajennettana koodia vielä siten, että se mahdollistaa uusien muistiinpanojen luomisen:

    const createNew = async (content) => {  
        const object = { content, important: false }  
        const response = await axios.post(baseUrl, object)  
        return response.data
    }

Sovelluksen nykyinen lähestymistapa on melko hyvä, mutta se on ikävä, sillä kommunikointi tapahtuu komponentit määrittelevien funktioiden koodissa. Parempi ratkaisu olisi abstrahoida siten, että tarvitsi ainoastaan kutsua sopivaa action creatoria. Alustus voisi tapahtua koodilla

    const App = () => {
        const dispatch = useDispatch()

        useEffect(() => {
            dispatch(initializeNotes())
        }, [dispatch]) 
        
        // ...
    }

ja muistiinpanon luonti koodilla

    const NewNote = () => {
        const dispatch = useDispatch()
        
        const addNote = async (event) => {
            event.preventDefault()
            const content = event.target.note.value
            event.target.note.value = ''
            dispatch(createNote(content))
        }

    // ...
    }

Näissä komponenteissa komponentit dispatchavat ainoastaan actionit välittämättä siitä, mitä taustalla todellisuudessa tapahtuu. Tämän kaltaieten asynkronisten actioneiden käyttö onnistuu Redux Thunk-kirjaston avulla, jonka käyttö ei vaadi ylimääräistä konfiguraatiota, kun Redux-store on luotu Redux Toolkitin configureStore funktiolla. Kirjasto voidaan asentaa komennolla npm install redux-thunk. Sen ansiosta on mahdollista toteuttaa asynkronisia action creatoreja, kuten:

    import noteService from '../services/notes'

    const noteSlice = createSlice(/* ... */)

    export const { createNote, toggleImportanceOf, setNotes, appendNote } = noteSlice.actions

    export const initializeNotes = () => {  
        return async dispatch => {    
            const notes = await noteService.getAll()    
            dispatch(setNotes(notes))  
        }
    }

    export default noteSlice.reducer

Nyt App voidaan määritellä seuraavasti:

    const App = () => {
        const dispatch = useDispatch()

        useEffect(() => {    
            dispatch(initializeNotes())   
        }, [dispatch]) 
        
        return (
            <div>
            <NewNote />
            <VisibilityFilter />
            <Notes />
            </div>
        )
    }

Tämä ratkaisu on paljon parempi. Korvataan vielä createSlice-funktion avulla toteutettu createNote-action creator seuraavasti:

    reducers: {
        toggleImportanceOf(state, action) {      
            const id = action.payload      
            const noteToChange = state.find(n => n.id === id)      
            const changedNote = {         
                ...noteToChange,         
                important: !noteToChange.important       
            }     
            return state.map(note =>        
                note.id !== id ? note : changedNote       
            )         
        },    
        appendNote(state, action) {      
            state.push(action.payload)    
        },    
        setNotes(state, action) {      
            return action.payload    
        }  
    },

    export const { toggleImportanceOf, appendNote, setNotes } = noteSlice.actions

    export const createNote = content => {  
        return async dispatch => {    
            const newNote = await noteService.createNew(content)    
            dispatch(appendNote(newNote))  
        }
    }

Nyt NewNote muuttuu seuraavasti:

    dispatch(createNote(content))

    
# Connect

Tarkastellaan lopuksi React Reduct kirjaston connect funktiota. Uusissa sovelluksissa kannattaa käyttää sen sijasta hook-apia (useDispatch, useSelector), mutta connect funktion tuntemisesta on hyötyä vanhempaa reduxia käyttävien projektien ylläpidossa. Luodaan ensiksi yhdistetty komponentti lisäämällä nämä komponenttiin Notes:


    import { connect } from 'react-redux'
    
    const ConnectedNotes = connect()(Notes)
    export default ConnectedNotes

Funktion connect ensimmäisenä parametrina voidaan määritellä funktio mapStateToProps, joka liittää joitakin storen tilan perusteella määriteltyjä asioita yhdistetyn komponentit propseiksi. Esimeriksi:

    const Notes = (props) => {  
        const dispatch = useDispatch()
    
        const notesToShow = () => {    
            if ( props.filter === 'ALL') {      
                return props.notes    
            }        
            
            return props.filter  === 'IMPORTANT'       
                ? props.notes.filter(note => note.important)      
                : props.notes.filter(note => !note.important)  
        }

        return (
            <ul>
            {notesToShow().map(note =>        
                <Note
                key={note.id}
                note={note}
                handleClick={() => 
                    dispatch(toggleImportanceOf(note.id))
                }
                />
            )}
            </ul>
        )
    }

    const mapStateToProps = (state) => {
        return {
            notes: state.notes,
            filter: state.filter,
        }
    }

    const ConnectedNotes = connect(mapStateToProps)(Notes)
    export default ConnectedNotes

Tässä Notes sisällä voidaan viitata storen tilaan propsien kautta, joten props.notes tuo muistiinpanot ja props.filter tuo filter kentän, eli ne antavat suoran pääsyn. UseSelector on nyt korvattu, joten tarkastellaan useDispatch korvausta. Connect funktion toisena parametrina voidaan määritellä mapDispatchToProps, joka on joukko action creator funktioita, jotka välitetään propseina. Lisätään connectaukseen seuraavat asiat:

    const mapDispatchToProps = {  toggleImportanceOf,}

    const ConnectedNotes = connect(
        mapStateToProps,
        mapDispatchToProps
    )(Notes)

Nyt, koodi dispatch(toggleImportanceOf(note.id)) korvataan props.toggleImportanceOf(note.id). Huomaa, että sen propsien suoran viittauksen lisäksi se viittaa actioneihin, jonka avulla storeen voidaan dispatchata eri actioneita. Jos komponentti ei tarvitse storen tilasta mitään, niin connect funktion ensimmäiseksi parametriksi laitetaan null. Tarkastellaan vielä seuraavaa asiaa:

    import { connect } from 'react-redux' 
    import { createNote } from '../reducers/noteReducer'
    const NewNote = (props) => {
        
        const addNote = async (event) => {
            event.preventDefault()
            const content = event.target.note.value
            event.target.note.value = ''
            props.createNote(content)  }

            return (
                <form onSubmit={addNote}>
                <input name="note" />
                <button type="submit">add</button>
                </form>
            )
    }

    export default connect(
        null, 
        { createNote }
    )(NewNote)

Tässä koodissa voi hämmentyä siitä, että createNotes on käytettävissä kaksi eri versiota. Funktioon on viitattava propsien kautta, eli props.createNote. Taas import lause mahdollistaa suoran viittauksen createNoten, mutta tätä ei tule tehdä, sillä se ei sisällä dispatchausta. Tämä ero huomataan seuraavasti konsolista:

    const NewNote = (props) => {
        console.log(createNote)
        console.log(props.createNote)

        const addNote = (event) => {
            event.preventDefault()
            const content = event.target.note.value
            event.target.note.value = ''
            props.createNote(content)
        }

        // ...
    }

Huomaa, että määrittelyssä

    export default connect(
        null,
        { createNote }
    )(NewNote)

dispatchataan uuden muistiinpanon lisäys ssuorana komennolla props.createNote('uusi muistiinpano'). MapDispatchToProps kenttinä ei voi antaa mitä tahansa funktioita, vaan funktion on oltava action creator, eli redux-actionin palauttava funktio. Tässä mapDispatchToProps on nyt olio, sillä 

    {
        createNote
    }

on lyhyempi tapa määritellä olioliteraali:

    {
        createNote: createNote
    }

Tässä voitaisiin myös määritellä pidemmän kaavan kautta:

    const mapDispatchToProps = (dispatch) => {  
        return {    
            createNote: (value) => {      
                dispatch(createNote(value))    
            },  
        }
    }

Tässä funktion paluuarvona on olio, joka määrittelee joukon funktiota, jotka annetaan propseiksi. Useimmissa tapauksissa onneksi riittää mapDispatchToProps:in yksinkertaisempi muoto, mutta on olemassa tilanteita, joissa monimutkaisempi muoto on tarpeen. 

Tarkastellaan vielä presentational vs container jaottelua react sovelluksissa, eli näkymästä huolehtiva vs toiminnasta huolehtiva. Tämän ajattelu tavan edut ovat helpompi sovelluksen ymmärrys, helpompi uudelleen käyttö ja presentional mahdollistaa sovelluksen paletin. Kannattaa myös huomioda termi higher-order componenti, jotka ovat funktiota, jotka haluavat parametriksi komponentteja muuttuakseen komponenteiksi. Tämän suosio on tosin kääntynyt laskuun hook-perustan takia.

Nyt saaduilla kurssi tiedoilla pystymme käytämmään reactia oikein. React keskittyy pelkästään näkymien muodostamiseen ja sovelluksen tilaan, kun taas sovelluslogiikka on eristetty kokonaan sen ulkopuolelle, reduxin ja action reducereihin. Huomaa, ettei ole olemassa hopea luotia jokaiseen sovellus ongelmaan. Sovelluksen tilan hallintaa on suunniteltava tarpeen mukaan, eikä reduxia välttämättä tarvitse yhtään hyvän sovelluksen luomiseksi, sillä se voidaan tehdä myös contex apia ja useReducer hookeina. Huomio omat tarpeet ja eri työkalujen tarpeet.

---




