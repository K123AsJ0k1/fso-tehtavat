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






