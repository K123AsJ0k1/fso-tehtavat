# Reactin alkeet

Npm versio voidaan tarkastaa komennolla:

    npm -v

React sovellus voidaan luoda komennolla:

    npx create-react-app part1

Sovellus voidaan käynnistää komennolla:

    npm start

Oletusarvoisesti sovelluskäynnistyy localhost portilla 3000, eli http://localhost:3000.

Seuraava komento renderöi komponentin sisällön tiedoston public/index.html määrittelemään div-elementtiin, jonka id:n arvona on 'root':

    ReactDOM.createRoot(document.getElementById('root')).render(<App />)

Reactissa kaikki renderöitävä sisältö määritellään komponenttien avulla, jotka voivat olla esimerkiksi muodoltaan:

    const App = () => (
        <div>
            <p>Hello world</p>
        </div>
    )

Seuraava on funktio, joka ei saa yhtään parametria:

    () => (
        <div>
            <p>Hello world</p>
        </div>
    )

, joka sijoitetaan vakioarvioisena muuttujaan app, eli const App = (...).

Seuraava funktio palauttaa lausekkeen arvon:

    const App = () => {
        return (
            <div>
            <p>Hello world</p>
            </div>
        )
    }

Funktiot voivat sisältää mitä tahansa javascript koodia. Huomaa, ettei export default App kannatta poistaa.

Komponenttien sisällä voidaan renderöidä myös dynaamista sisältöä, kuten:

    const App = () => {
        const now = new Date()
        const a = 10
        const b = 20

        return (
            <div>
            <p>Hello world, it is {now.toString()}</p>
            <p>
                {a} plus {b} is {a + b}
            </p>
            </div>
        )
    }

Huomaa, ettei React palauta HTML koodia, vaan React käyttää JSX ja se käännettään Babel. avulla Java scriptiksi. Tämä on konfigurioitu tapahtumaan automaattisesti. JSX on käytännössä melkein kuin HTML, mutta sen mukaan voi helposti upottaa dynaamista sisältöä JavaScript aaltosulkeilla.

JSX:ssä jokainen tagi tulee sulkea, minkä takia HTML:ssä oleva tyhjä elementti (br) on kirjoitettava (br /) JSX:ssä.

Komponentissa voidaan käyttää monia komponentteja, kuten:

    const Hello = () => {  
        return (    
            <div>      
                <p>Hello world</p>    
            </div>  
        )
    }

    const App = () => {
        return (
            <div>
            <h1>Greetings</h1>
            <Hello />     
            <Hello />
            </div>
        )
    }

Luomalla ja yhdistämällä komponentteja voidaan luoda monimutkaisempiakin sovelluksia, minkä takia Reactin filosofia on koostaa sovellus useista pieneen asiaan keskittyvistä uudelleenkäytettävistä komponenteista. Vahva konventio on, että juuri komponentti on nimeltään App.

Komponenteille voidaan välittää dataa propsien avulla, jonka seurauksesta voidaan tehdä:

    const Hello = (props) => {  
        return (
            <div>
                <p>Hello {props.name}</p>    
            </div>
        )
    }

Propsit määritellään:

    const App = () => {
        return (
            <div>
                <h1>Greetings</h1>
                <Hello name="Maya" />      
                <Hello name="Pekka" />    
            </div>
        )
    }

Propseja voi olla mielivaltainen määrä, niiden arvot voivat olla kovakoodattuja ja JavaScriptin tapauksessa niiden arvot tulee olla aaltosulkeissa, kuten seuraavasti:

    const Hello = (props) => {
        return (
            <div>
            <p>
                Hello {props.name}, you are {props.age} years old      
            </p>
            </div>
        )
    }

    const App = () => {
        const nimi = 'Pekka'  
        const ika = 10
        return (
            <div>
                <h1>Greetings</h1>
                <Hello name="Maya" age={26 + 10} />      
                <Hello name={nimi} age={ika} />    
            </div>
        )
    }

React antaa aika hyvä virheilmoituksia, mutta kannattaa edetä alussa todella pienin askelin ja varmistaa, että jokainen muutos toimii halutulla tavalla. Huomaa, että konsolin tulee olla koko ajan auki ja ettei kannata sokeasti kirjoittaa lisää koodia, vaan yrittää ymmärtää virheen syy.

On suositeltavaa laittaa react koodissa console.log() komentoja, jotka tulostavat konsoliin.

Pidä mielessä, että React komponenttien nimet tulee alkaa isolla kirjaimella ja niiden sisällön on sisällettävä yksi juuri elementti. Esimerkiksi nämä ovat virheellisiä, joista ensimmäisessä komponetti footer on pienellä ja toisessa puuttuu (div):

    const App = () => {
        return (
            <div>
            <h1>Greetings</h1>
            <Hello name="Maya" age={26 + 10} />
            <footer />    
            </div>
        )
    }

    const App = () => {
        return (
            <h1>Greetings</h1>
            <Hello name="Maya" age={26 + 10} />
            <Footer />
        )
    }

Juurielementti ei tosin ole ainoa tapa, vaan myös taulukollinen komponentteja toimii:

    const App = () => {
        return [
            <h1>Greetings</h1>,
            <Hello name="Maya" age={26 + 10} />,
            <Footer />
        ]
    }

Tavallinen tapa tosin lisää ylimääräisen (div) elementit DOM puuhun, minkä takia seuraava tapa voi olla tarpeen:

    const App = () => {
        const name = 'Pekka'
        const age = 10

        return (
            <>
                <h1>Greetings</h1>
                <Hello name="Maya" age={26 + 10} />
                <Hello name={name} age={age} />
                <Footer />
            </>
        )
    }

# Javascriptin perusteet

Javascript standarding virallinen nimi on ECMAScript. Selaimet eivät vielä osaa kaikkia JavaSciptin uusimpien versioiden ominaisuuksia, minkä takia selaimet yleensä suorittavat uudemmasta vanhempaan käännettyä koodia.

Johtavin tapa tehdä transpilointi on Babel, joka on automaattisesti konfigurioitu create-react-app:in luomissa sovelluksissa. Huomattavaa on se, että Node.js on melkein missä tahansa palvelimella toimiva.

Noden koodi kirjoitetaan .js päätteiseen tiedostoon ja suoritetaan komennolla node tiedosto.js. Sitä voidaan kirjoittaam yös Node.js konsoliin, joka aukeaa node komennolla tai developer tool konsoliin.

JavaScript muistuttaa nimensä ja syntaksinsa puolesta Javaa, mutta ne eroavat radikaalisti perusmekanismeiltaan. 

JavaScriptissa const on vakio, eli sitä ei voi enää muuttaa. Let taas määrittelee normaalin muuttujan. Sen tyyppi voi vaihtua suorituksen aikana. On myös mahdollista käyttää var, mutta sen käyttö ei ole tämän kurssin aikana suositeltavaa.

Huomaa, että console.log() tulostaa JavaScriptissä.

JavaSciptissä taulukon sisältö voidaan muuttaa, vaikka se on määritelty const, koska se on samaan olioon viittaava. Sen indeksi arvo saadaan [n] avulla, pituus saadaan .length ja siihen voidaan lisätä .push() avulla.

Taulukko voidaan käydä läpi .foreach avulla, jonka sisällä on value => {console.log(value)}. Huomaa, että forEachin parametrina oleva funktio voi saada myös muita parametreja. 

React-koodin pyrkiessä funktionaalisen ohjelmointiin, on suositeltavaa käyttää concat komentoa, joka mahdollistaa taulukon kopioimisen. Esimerkiksi t.concat(5) ei lisää uutta alkiota vanhaan taulukkoon, vaan palauttaa uuden taulukon:

    const t = [1, -1, 3]

    const t2 = t.concat(5)

    console.log(t)  // tulostuu [1, -1, 3]

Taulukot omistavat monia hyödyllisiä operaatioita, kuten map, joka luo uuden taulukon. Esimerkiksi sen avulla voidaan luoda HTML koodia sisältävän taulukon, kuten:

    const m2 = t.map(value => '<li>' + value + '</li>')
    console.log(m2)  
    // tulostuu [ '<li>1</li>', '<li>2</li>', '<li>3</li>' ]

Taulukon yksittäisiä alkiota voidaan helposti sijoittaa destrukoitvan sijoituslauseen avulla, kuten:

    const t = [1, 2, 3, 4, 5]

    const [first, second, ...rest] = t

    console.log(first, second)  // tulostuu 1, 2
    console.log(rest)          // tulostuu [3, 4 ,5]

Javascriptissa on eri tapoja määritellä oliota, joista yleisin on olioliteraali, kuten:

    const object1 = {
    name: 'Arto Hellas',
    age: 35,
    education: 'Filosofian tohtori',
    }

    const object12 = {
    name: 'Full Stack -websovelluskehitys',
    level: 'aineopinto',
    size: 5,
    }

    const object3 = {
    name: {
        first: 'Juha',
        last: 'Tauriainen',
    },
    grades: [2, 3, 5, 3],
    department: 'TKTL',
    }

Näiden kenttien arvot voivat olla mitä vaan ja niihin viitataan joko pistenotaatiolla tai hakasulkeilla seuraavasti:

    console.log(object1.name)         // tulostuu Arto Hellas
    const fieldName = 'age' 
    console.log(object1[fieldName])    // tulostuu 35

Olioille voidaan lisätä kenttiä lennossa joko pistenotaation tai hakasulkeiden avulla seuraavasti:

    object1.address = 'Tapiola'
    object1['secret number'] = 12341

Oliota voidaan myös määritellä konstruktorifunktioiden avulla, mutta JavaScript ei sisällä luokkia samassa mielessä kuin olio-ohjelmointikielessä.

JavaScriptin funktiot voidaan määritellä seuraavasti:

    const sum = (p1, p2) => {
        console.log(p1)
        console.log(p2)
        return p1 + p2
    }

Funktio voidaan kutsua seuraavasti:

    const result = sum(1, 5)
    console.log(result)

Jos parametreja on yksi, niin sulut voidaan jättää määrittelyssä pois:

    const square = p => {
        console.log(p)
        return p * p
    }

Jos funktio sisältää ainoastaan yhden lausekkeen, niin aaltosulkeita ei tarvita, kuten seuraavasti:

    const square = p => p * p

Edellinen tapa on kätevää map metodin tapauksessa, kuten:

    const t = [1, 2, 3]
    const tSquared = t.map(p => p * p)
    // tSquared on nyt [1, 4, 9]

Funktiot voidaan määritellä kahdella tavalla, eli function decloration 

    function product(a, b) {
    return a * b
    }

    const vastaus = product(2, 6)

tai funktiolauseke

    const average = function(a, b) {
    return (a + b) / 2
    }

    const vastaus = average(2, 5)

Tällä kurssilla kaikki funktiot määritellään nuolisyntaksilla.

Reacting komponenttien sisälle voidaan luoda apufunktioita seuraavasti:

    const Hello = (props) => {
        const bornYear = () => {    
            const yearNow = new Date().getFullYear()    
            return yearNow - props.age  
        }
        return (
            <div>
                <p>Hello {props.name}, you are {props.age} years old</p>
                <p>So you were probably born {bornYear()}</p>    
            </div>
        )
    }

Huomaa, ettei tähän apufunktioon tarvitse välittää propseja, sillä se näkee komponentille välitetyt propsit.

Propsin ollessa olio, voidaan destruktioinin avulla suoraviivaista koodia seuraavasti:

    const Hello = (props) => {
        const name = props.name  const age = props.age
        const bornYear = () => new Date().getFullYear() - age
        return (
            <div>
            <p>Hello {name}, you are {age} years old</p>      <p>So you were probably born {bornYear()}</p>
            </div>
        )
    }

Huomaa, että tässä bornYear on määritelty ilman aaltosulkeita, sillä se koostuu ainoastaan yhdestä komennosta. Kyseisestä syystä sama funktio voidaan määritellä kahdella eri tavalla:

    const bornYear = () => new Date().getFullYear() - age

    const bornYear = () => {
        return new Date().getFullYear() - age
    }

Destruktointi siis helpottaa apumuuttujien määrittelyä, sillä propsien arvot voidaan kerätä yksittäisiin muuttujiin, kuten const {name, age} = props. Tämä voidaan viedä pidemmälle määrittelemällä const Hello = ({name, age}) => {}.

Sivu voidaan saada renderöitymään kolme kertaa seuraavasti:

    let counter = 1

    const refresh = () => {
        ReactDOM.createRoot(document.getElementById('root')).render(
            <App counter={counter} />
        )
    }

    refresh()
    counter += 1
    refresh()
    counter += 1
    refresh()

Automaattinen tapa tehdä näin toistuvasti sekunnin välein on käyttää SetInterval medodia seuraaavasti:

    setInterval(() => {
    refresh()
    counter += 1
    }, 1000)

Tosin huomaa, ettei render funktion toistuva kutsuminen ole hyvä tapa päivittää komponentteja, vaan parempi tapa on käyttää state hookeja seuraavasti:

    import { useState } from 'react'
    const App = () => {
        const [ counter, setCounter ] = useState(0)
        setTimeout(    () => setCounter(counter + 1),    1000  )
        return (
            <div>{counter}</div>
        )
    }

    export default App

Tässä { useState } from 'react' tuo useState metodin ja const [ counter, setCounter ] = useState(0) luo komponentille alkuarvon 0 saavan tilan. Tässä counter pitää sisällään tilan arvon ja setCounter on viite funktio, jonka avulla tila voidaan muuttaa. Näiden takia funktio setTimeout määrittelee setCounter(counter + 1).

Kun tilaa muuttava funktiota setCounter kutsutaan, renderöi react komponentin uudelleen, eli se suorittaa komponentin koodin uudelleen. Huomaa, että funktion useState kutsuminen palauttaa jo olemassaolevan tilan arvon, joka on toisella kerralla 1.

Tapahtumankäsittelijät ovat funktiota, joita kutsutaan tiettyjen tapahtumien yhteydessä. Esimerkki tapahtumakäsittelijästä on:

    const handleClick = () => {    
        console.log('clicked')  
    }
    return (
        <div>
            <div>{counter}</div>
            <button onClick={handleClick}>        
            plus      
            </button>    
        </div>
    )


Elementti tapahtumakäsittelijät, joista yksi mahdollistaa +1 kasvatuksen ja arvon muuttamisen 0, voidaan rakentaa seuraavasti:

    <button onClick={() => setCounter(counter + 1)}>
        plus
    </button>
    
    <button onClick={() => setCounter(0)}>         
        zero      
    </button>

Huomaa, että tapahtumakäsittelijäksi on tarkoitus määritellä joko funktio tai viite funktio, minkä takia (button onClick={setCounter(counter+1)}) ei toimi, sillä se on funktiokutsu.

Huomaa myös se, ettei tapahtumakäsittelijöiden suora määrittely JSX-templaten sisällä ole viistasta, minkä takia parempi tapa on:

    const App = () => {
        const [ counter, setCounter ] = useState(0)

        const increaseByOne = () => setCounter(counter + 1)    
        const setToZero = () => setCounter(0)
        return (
            <div>
                <div>{counter}</div>
                <button onClick={increaseByOne}>       
                    plus
                </button>
                <button onClick={setToZero}>        
                    zero
                </button>
            </div>
        )
    }

Reactissa suositaan pieniä komponentteja, joita on mahdollista uusio käyttää sovelluksen eri osissa tai jopa eri sovelluksissa. Huomaa, että tilan sijoitus riittävän ylsö komponenttihierarkiassa on hyvä käytäntö. Näiden tietojen avulla saadaan seuraava sovellus koodi, joka mahdollistaa +1, resetoinin ja -1 toimet:

    import { useState } from 'react'

    const Display = (props) => {
        return (
            <div>{props.counter}</div>
        )
    }

    const Button = (props) => {
        return (
            <button onClick={props.handleClick}>
            {props.text}
            </button>
        )
    }

    const App = () => {
        const [ counter, setCounter ] = useState(0)

        const increaseByOne = () => setCounter(counter + 1)
        const decreaseByOne = () => setCounter(counter - 1)
        const setToZero = () => setCounter(0)

        return (
            <div>
            <Display counter={counter}/>      
            <Button       
            handleClick={increaseByOne}        
            text='plus'     
            />      
            <Button       
            handleClick={setToZero}        
            text='zero'     
            />           
            <Button        
            handleClick={decreaseByOne}        
            text='minus'      
            />   
            </div>
        )
    }

    export default App

Käytännössä tämä sovellus toimii seuraavasti: App koodin suoritus luo useState-hookin asettamalla laskurin tilan counter ja komponentti renderöi laskimenn alkuarvon 0 näyttävän komponentin display ja button komponenttia. Kun jotain nappia painetaan, suoritetaan sen mukainen tapahtumakäsittelijä, joka aiheuttaa komponentin uudellenrenderöitymisen.

Huomaa myös se, että tämä sovelluksen ali komponentit voidaan refaktoirida muotoihin:

    const Display = ({ counter }) => <div>{counter}</div>

    const Button = ({ handleClick, text }) => (
        <button onClick={handleClick}>
            {text}
        </button>
    )

Jos materiaalin koodi aiheuttaa ongelmia Reactin kannalta, niin muuta package.json muotoon

    {
    "dependencies": {
        "react": "^17.0.2",    
        "react-dom": "^17.0.2",    
        "react-scripts": "5.0.0",
        "web-vitals": "^2.1.4"
    },
    // ...
    }

ja asenna tarvittavat riippuvuudet uudelleen komennolla

    npm install

Huomaa myös se, että index.js eroaa, sillä React 17:n muoto on

    import ReactDOM from 'react-dom'
    import App from './App'

    ReactDOM.render(<App />, document.getElementById('root'))

, kun taas React 18 käyttää muotoa:

    import React from 'react'
    import ReactDOM from 'react-dom/client'

    import App from './App'

    ReactDOM.createRoot(document.getElementById('root')).render(<App />)

Helpoin ja usein paras tapa luoda sovellukselle eri tiloja on kutsua useState useampaan kertaan. Komponentin tila tai yksittäinen tilan pala voi olla minkä tahansa tyyppinen. On myös mahdollista toteuttaa samanlaiset toiminnallisuudet olion avulla, jolloin komponentti tarvitsee ainoastaan yhden tilan.

Olioiden tapauksessa tyylikkäämpi tapa kirjoittaa on object spread syntaksi, jossa { ...clicks } luo olion ja siihen voidaan lisätä asioita { ...clicks, right: 1 }, minkä seurauksesta voidaan luoda vasemman ja oikean nappin painamisesta huolehtivat tapahtumakäsittelijät:

    const handleLeftClick = () =>
        setClicks({ ...clicks, left: clicks.left + 1 })

    const handleRightClick = () =>
        setClicks({ ...clicks, right: clicks.right + 1 })

Huomio, että syy 

    const handleLeftClick = () => {
        clicks.left++
        setClicks(clicks)
    }

toimimattomuuteen on se, että tilan muutos on aina tehtävä asettamalla uudeksi tilaksi vanhan perustella tehty kopio.

Huomaa, että jokaisen tilan pitäminen yhdessä oliossa on huono ratkaisu, sillä se monimutkaistaa sovellusta. Täten parempi tapa on luoda tiloista palasia.

Taulukko voidaan luoda esimerkiksi const [allClicks, setAll] = useState([]). Metodilla join voidaan muodostaa taulukosta merkkijono, jossa merkit on erotettu halutulla tavalla.

Reactissa komponentin ehdollinen renderöinti voidaan tehdä seuraavasti:

    const History = (props) => {  
        if (props.allClicks.length === 0) {    
            return (      
            <div>        
                the app is used by pressing the buttons      
            </div>    
            )  
        }  
        return (    
            <div>      
            button press history: {props.allClicks.join(' ')}    
            </div>  
        )
    }

Huomaa, että state hook alettiin käyttämään Reactin versiossa 16.8.0, minkä seurauksesta maailmassa on edelleen miljardeja rivejä vanhaa Reactia, jota saatat joutua ylläpitämään. Tämän kurssin aikana tosin käytetään pelkästään hookeja, mutta class komponentit käydään kurssin seitsemännessä osassa läpi.

Huomaa, että debugausessa älä yhdistele asioita javamaisesti plussalla, vaan erota ne toisistaan pilkulla kuten console.log('props value is', props). Tämä ei tosin ole ainoa tapa debugata, vaan Chromen dev konsolin debugger komento suoritetaan. Muuttujien tilaa voidaan tarkastella console välilehdellä.

Kun bugi selviää, niin debugger komennon voi poistaa ja ladata sivu uudelleen. Siinä on mahdollista suorittaa koodia tarvittaessa rivi riviltä Sources-välilehden oikealta laidalta. On myös suositeltavaa, että käyttää react developer tools:ja, jonka components näyttää tilojen tiedot.

Huomaa, että sovelluksen tilat vaativat sen, että hookeja käytetään tietyjen rajoitusten mukaisesti. UseState ja useEffectia ei saa kutsua loopissa, ehtolausekkeiden sisältä tai muista kuin komponentin määrittelevästä funktiosta. Tämä takaa, että hookeja kutsutaan aina samassa järjestyksessä, joten:

    const App = (props) => {
        // nämä ovat ok
        const [age, setAge] = useState(0)
        const [name, setName] = useState('Juha Tauriainen')

        if ( age > 10 ) {
            // ei ehtolauseessa
            const [foobar, setFoobar] = useState(null)
        }

        for ( let i = 0; i < age; i++ ) {
            // eikä myöskään loopissa
            const [rightWay, setRightWay] = useState(false)
        }

        const notGood = () => {
            // ei muiden kuin komponentin määrittelevän funktion sisällä
            const [x, setX] = useState(-1000)
        }

        return (
            //...
        )
    }

Tapahtumakäsittelijät voidaan myös määritellä siten, että palauttavat funktion. Tätä tyyliä ei tosin tulla käyttämään kurssin aikana, mutta ne ovat aika yleisiä funktionaalista ohjelmointityyliä käyttäessä. Tällä tavalla voidaan luoda seuraava sovellus:

    const App = (props) => {
        const [value, setValue] = useState(10)

        const hello = () => {    
            const handler = () => console.log('hello world')    
            return handler  
        }
        return (
            <div>
            {value}
            <button onClick={hello()}>button</button>
            </div>
        )
    }

Huomaa, että tässä {hello()} olellisesti muuttuu muotoon {() => console.log('hello world')}. Tämä tapa on siitä hyödyllinen, että se mahdollistaa parametrien viemisen seuraavalla tavalla:

    const App = (props) => {
        const [value, setValue] = useState(10)

        const hello = (who) => {    
            const handler = () => {      
                console.log('hello', who)    
            }    
            return handler  
        }

        return (
            <div>
            {value}
            <button onClick={hello('world')}>button</button>      <button onClick={hello('react')}>button</button>      <button onClick={hello('function')}>button</button>    </div>
        )
    }

Huomaa se, ettei komponetteja määritellä komponenttien sisällä, kuten:

    // tämä on oikea paikka määritellä komponentti!
    const Button = (props) => (
        <button onClick={props.handleClick}>
            {props.text}
        </button>
    )

    const App = (props) => {
        const [value, setValue] = useState(10)

        const setToValue = newValue => {
            console.log('value now', newValue)
            setValue(newValue)
        }

        // älä määrittele komponenttia täällä!
        const Display = props => <div>{props.value}</div>
        return (
            <div>
            <Display value={value} />
            <Button handleClick={() => setToValue(1000)} text="thousand" />
            <Button handleClick={() => setToValue(0)} text="reset" />
            <Button handleClick={() => setToValue(value + 1)} text="increment" />
            </div>
        )
    }

Tämä tapa on hyödytön ja tekee komponenttien optimoinnista mahdotonta.

# HTML taulukoiden perusteet

Taulukot mahdollistavat kätevän tavan näyttää suuren määrän informaatiota helposti ymmärettävällä tavalla. Näitä ennen käytettiin nettisivujen rakenteina CSS tuen huonouden takia, mutta tämä on huono idea.

Reactin tapauksessa HTML taulukko koostuu (table), (tbody), (tr), (th), (colgroup) ja (col) elementeistä. 

(table) ja (tbody) antavat rakenteen, jossa (table) sisältää taulukot ja (tbody) sisältää taulukon.

(tr) ja (th) luovat taulukon neliöt siten, että (tr) luo rivin ja (th) luo sarakkeen. (colgroup) ja (col) tekevät samoin, mutta ne antavat paremman tyylitystavat. 

Huomaa, että (div) ei saa löytyä taulukon sisältä, vaan se on oltava elementtihierarkiassa (table) elementtiä suurempi. Reactissa hyväksyttävä taulukko on seuraava:

    <div>
        <table>
            <tbody>
                <tr>
                    <td>Otsikko</td>
                    <td>Arvo</td>
                </tr>
            </tbody>
        </table>
    </div>

---

