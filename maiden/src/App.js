import { useState, useEffect } from 'react'
import axios from 'axios'

const CountrySearch = (props) => {
  const handleCountryChange = (event) => {
    props.setCountry(event.target.value)
  }

  return (
    <div>
      find countries <input onChange = {handleCountryChange}/>
    </div>
  )
}

const CountryList = (props) => {
  if (2<= props.countries.length && props.countries.length <= 10) {
    const list = props.countries.map(country => <p key = {country.name.common}>{country.name.common}</p>)
    return (
      <div>
        { list }
      </div>
    )
  }
  if (props.countries.length === 1) {
    const language_map = props.countries[0].languages
    let objKeys = Object.keys(language_map)
    let languages = []
    objKeys.forEach(key => {
      languages.push(language_map[key])
    })
    const list = languages.map(language => <li key = {language}>{language}</li>)
    return (
      <div>
        <h2>{props.countries[0].name.common}</h2>
        capital {props.countries[0].capital}
        <br/>
        area {props.countries[0].area}
        <h3>languages:</h3>
        <ul>
          { list }
        </ul>
        <img src = {props.countries[0].flags['png']} width = "16%" length = "16%" alt="Image of a flag"/>
      </div>
    )
  }

  return (
    <div>
      Too many matches, specify another filter
    </div>
  )
}

function App() {
  const [country, setCountry] = useState('')
  const [countries, setCountries] = useState([])
  //const [url, setUrl] = useState('https://restcountries.com/v3.1/all')
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
  },[country, setCountry])
  
  return (
    <div>
      <CountrySearch country = {country} setCountry = {setCountry}/>
      <CountryList countries = {countries}/>
    </div>
  )
}

export default App;
