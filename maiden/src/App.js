import { useState, useEffect } from 'react'
import axios from 'axios'

const CountrySearch = (props) => {
  const handleCountryChange = (event) => {
    props.setCountries([])
    props.setShowCountry('')
    props.setCountry(event.target.value)
  }

  return (
    <div>
      find countries <input onChange = {handleCountryChange}/>
    </div>
  )
}

const CountryList = (props) => {
  if (!(props.showCountry === '')) {
    return (
    <div></div>
    )
  }

  const handleShowButton = (event) => {
    props.setShowCountry(event.target.name)
  }

  if (props.countries.length > 10) {
    return (
      <div>
        Too many matches, specify another filter
      </div>
    )
  }

  if (2 <= props.countries.length && props.countries.length <= 10) {
    const list = props.countries.map(country => 
    <div key = {country.name.common}>
      {country.name.common}
      <button name={country.name.common} onClick={handleShowButton}>show</button>
      <br/>
    </div>
    )
    return (
      <div>
        { list }
      </div>
    )
  }
}

const Country = (props) => {
  const language_map = props.country.languages
  let objKeys = Object.keys(language_map)
  let languages = []
  objKeys.forEach(key => {
      languages.push(language_map[key])
  })
  const language_list = languages.map(language => <li key = {language}>{language}</li>)
  
  return (
    <div>
      <h2>{props.country.name.common}</h2>
      capital {props.country.capital}
      <br/>
      area {props.country.area}
      <h3>languages:</h3>
      <ul>
        { language_list }
      </ul>
      <img src = {props.country.flags['png']} width = "16%" length = "16%" alt="Image of a flag"/>
    </div>
  )
}

const CountryShow = (props) => {
  if (props.countries.length === 0) {
    return (
      <div>
        No country found
      </div>
    )
  }
  
  if (props.countries.length === 1) {
    return (
      <div>
        <Country country = {props.countries[0]}/>
      </div>
    )
  }
  
  let selected_country = 0
  props.countries.forEach(country => {
    if(country.name.common === props.showCountry) { 
      selected_country = country
    }
  })
  
  if (!(selected_country === 0)) {
    return (
      <div>
        <Country country = {selected_country}/>
      </div>
    )
  }

  return (
    <div></div>
  )
}

function App() {
  const [country, setCountry] = useState('')
  const [countries, setCountries] = useState([])
  const [showCountry, setShowCountry] = useState('')
  let url = 'https://restcountries.com/v3.1/all'
  
  useEffect(() => {
    if (!(country === '')) {
      url = 'https://restcountries.com/v3.1/name/' + country
    }
    axios
        .get(url)
        .then(response => {
          setCountries(response.data)
        }).catch(function (error) {
          if (error.response) {
            console.log(error.response.status)
          }
          setCountries([])
        })
  },[country])
  
  return (
    <div>
      <CountrySearch 
        country = {country} 
        setCountries = {setCountries} 
        setCountry = {setCountry} 
        setShowCountry = {setShowCountry}
      />
      <CountryList 
        countries = {countries} 
        showCountry = {showCountry} 
        setShowCountry = {setShowCountry}
      />
      <CountryShow 
        countries = {countries}
        showCountry = {showCountry}
      />
    </div>
  )
}

export default App;
