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

