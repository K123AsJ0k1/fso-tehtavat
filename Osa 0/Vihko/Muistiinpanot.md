# HTML perusteet

HTML perustuu elementtien sarjoihin, joita voidaan muokata tarpeiden mukaisesti hyödyntämällä niiden mukaisia tägeja. Esimerkiksi (p)My cat is very grumpy(/p) on kokonaisuudessa elementti, jossa (p) on avaava tägi, 'My cat is very grumpy' on sisältö ja (/p) on sulkeva tägi.

Elementeillä voi olla ominaisuuksia, kuten (p class="editor-note"), jotka sisältävät ekstra informaatiota elementtiin liittyen. Ominaisuuksilla on oltava tyhjä sen ja nimen välillä, sen nimeä on seurattava = merkki ja sen arvo on oltava "" sisällä.

Elementtien sisälle voidaan laittaa muita elementtejä, eli asettaa ne. Esimerkiksi (p)My cat is (strong)very(/strong) grumpy.(/p). Huomattavaa on se, että elementtien on avauduttava ja sulkeuduttava oikealla tavalla, sillä muuten selaimen on tulkittava.

Jotkin elementit eivät sisällä mitään, minkä takia niitä kutsutaan tyhjiksi elementeiksi. Esimerkiksi (img src="images/firefox-icon.png" alt="Myt test image"). Tämä elementti sisältää kaksi ominaisuutta, mutta ei avavaa ja sulkevaa tägiä. Tarkastellaan seuraavaa tiedosto index.html:

    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>My test page</title>
    </head>
    <body>
        <img src="images/firefox-icon.png" alt="My test image">
    </body>
    </html>

- (!DOCTTYPE html) on pakollinen osa
- (html) on juuri elementti
- (head) sisältää sivun tavarat, jotka eivät näy sivua tarkasteleville
- (meta charset="utf-8") asettaa kirjainsetiksi UTF-8
- (title) asettaa sivun otsikon
- (body) sisältää sivun tavarat, jotka näkyvät sivua tarkasteleville

Tarkastellaan:

    <img src="images/firefox-icon.png" alt="My test image">

Tässä src antaa polun kuva tiedostolle ja alt antaa vaihtoehtoisen tavan tulkita sen.

HTML käyttää 6 eri otsikko kokoa, eli (h1)-(h6), mutta yleisemmät otsikot ovat:

    <!-- 4 heading levels: -->
    <h1>My main title</h1>
    <h2>My top level heading</h2>
    <h3>My subheading</h3>
    <h4>My sub-subheading</h4>

Huomaa, että (!-- ja ---) välissä oleva asia on komentoitua sisältöä.

Kappaleita saadaan (p) elementillä, kuten:

    <p>This is a single paragraph</p>

Listat koostuvat vähintään kahdesta elementissä. Yleisemmät lista tyypit ovat järjestämätön ja järjestetty lista, joista ensimmäinen saadaan (ul) elementillä ja toinen saadaan (ol) elementillä. Jokainen listan osanen laitetaan (li) sisälle. Esimerkiksi kappale

    <p>At Mozilla, we're a global community of technologists, thinkers, and builders working together ... </p>

Voidaan muuttaa muotoon

    <p>At Mozilla, we're a global community of</p>

    <ul>
    <li>technologists</li>
    <li>thinkers</li>
    <li>builders</li>
    </ul>

    <p>working together ... </p>

Linkkien elementti on (a), joka voi olla muodoltaan seuraava:

    <a href="https://www.mozilla.org/en-US/about/manifesto/">Mozilla Manifesto</a>

# CSS perusteet

CSS käytetään valitsemaan HTML elementtien tyylit. Sen tiedosto on nimettävä .css tavalla ja sen sisältämää tekstiä kutsutaan säännöiksi. Sääntö koostuu valitsimista, ominaisuudesta ja ominaisuus arvosta. Esimerkiski p {color: red;} on sääntö, p on valitsin, color on ominaisuus ja red on ominaisuus arvo. Ne on kirjoitettava seuraavasti:

    p {
    color: red;
    width: 500px;
    border: 1px solid black;
    }

Sääntöön voi myös kuulua monia elementtejä, kuten:

    p, li, h1 {
    color: red;
    }

Valitsijoita on monenlaisia. Yleisemmät ovat elementti/p, ID/#my-id, luokka/.my-class, ominaisuus/img[src] ja pseudo-luokka/a:hover, mutta nämä eivät ole ainoat.

Huomio, että /* ja */ välissä olevat asiat ovat kommentteja CSS:ssä.

CSS asettelu voidaan ajatella siten, että HTML elementit ovat toisten laatikoiden päällä olevia laatikoita. Jokainen laatikko omistaa padding (sisällön ympärillö oleva tavara), border (linja paddinging ulkopuolella) ja margin (borderin ulkipuolella oleva tila) ominaisuudet. Muita kiinnostavia ominaisuuksia ovat:

- width (elementtin leveys)
- background-color (elementin sisällän ja padding takana oleva väri)
- color (elementin väri)
- text-shadow (asettaa varjon elementin tekstille)
- display (asettaa elementin display tilan)

Sivun väri voidaan muuttaa esimerkiksi:

    html {
    background-color: #00539F;
    }

Rakenne voidaan muuttaa esimerkiksi:

    body {
    width: 600px;
    margin: 0 auto;
    background-color: #FF9500;
    padding: 0 20px 20px 20px;
    border: 5px solid black;
    }

Asemointi voidaan tehdä esimerkiksi:

    h1 {
    margin: 0;
    padding: 20px 0;
    color: #00539F;
    text-shadow: 3px 3px 1px black;
    }

Kuva voidaan keskittää esimerkiksi:

    img {
    display: block;
    margin: 0 auto;
    }

# Verkkolomakkeen perusteet

Verkkolomakkeet ovat yksi päätavoista, joilla käyttäjä vuorovaikuttaa sivuston kanssa. Se mahdollistaa datan lisäämisen tai sitä käytetään päivittämään välittömästi käyttöliittymää. Verkkolomakeet koostuvat yhdestä tai monesta lomake kontrollista, jotka voivat olla yhden tai monen rivin tekstikenttiä, tiputus laatikoita, nappeja, tarkastus laatikoita tai radio nappeja.

Huomattavaa verkkolomakkeisiin liittyen on se, että on suositeltavaa ajatella ennen koodausta, miltä ne pitäisi näyttää. Käyttäjäjien kannalta isot ja monimutkaiset lomakkeet aiheuttavat ärsyyntymistä, mikä vaikuttaa käyttäjien määrään. Tämän takia on suositeltavaa pysyä yksikertaisena ja keskittyneenä, eli kysy ainoastaan tarvittuja asioita.

Kaikki lomakkeet alkavat:

    <form action="/my-handling-form-page" method="post">

    </form>

Se on (section) tai (footer) kaltainen kontti elementti. Suurin osa sen ominaisuuksista on vapaaehtoisia, mutta standardi on laittaa ainakin action ja method. Action kertoo URL, johon lomakkeet data pitäisi lähettää. Method kertoo, mitä HTTP metodia käyttää datan lähettämisessä.

Tässä (li) helpottaa tyylittämistä ja (for) antaa lomake kontrollin tunnisteen kannalta.

(input) elementin tapauksessa tärkein ominaisuus on type, sillä se määrää, miten se näkyy ja käytäytyy.

Huomattavaa tässä on se, että (input) on tyhjä elementti ja (textarea)(/textarea) on elementti. Tämä aiheuttaa sen, että asettettu arvo luodaan seuraavasti: 

    <input type="text" value="by default this element is filled with this text">

Jos halutaan asettaa arvo tekstikentälle. niin se tehdään seuraavasti:

    <textarea>
    by default this element is filled with this text
    </textarea>

Nappi lomakkeen lähettämiseen voidaan luoda asettaa seuraavasti:

    <li class="button">
    <button type="submit">Send your message</button>
    </li>

Nappit hyväksyvät myös tyyppi ominaisuudet, jotka voivat olla submit (lähettää datan), reset (tuo takaisin asetetut arvot) ja button (ei tee mitään, minkä takia sitä voidaan käyttää omien nappien luomiseen).

Jos haluaa muuttaa sivun tyyliä, niin lisää teksti (style) (/style) tekstin (html) (/html) sisälle, jonka jälkeen laita (style) (/style) sisälle tarvittava CSS.

Lähettääksemme lomakkeen, on jokaiselle sen kontrollille annetta name ominaisuus. Lomakke lähettää datan name/value pareina.

---



















