import { useState, useEffect } from 'react'
import axios from 'axios'
import numberService from './services/numbers'

const Filter = (props) => {
  const handleFilterChange = (event) => {
    props.setNewFilter(event.target.value)
  }

  return (
    <div>
      filter show with
      <input onChange = {handleFilterChange}/>
    </div>
  )
}

const PersonForm = (props) => {
  const handleNameChange = (event) => {
    props.setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    props.setNewNumber(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()

    const copyPerson = props.persons.find(person => person.name === props.newName)
    
    if (!(copyPerson === undefined)) {
      alert(`${props.newName} is already added to phonebook`)
      return 0
    }

    const personObject = {
      name: props.newName,
      number: props.newNumber,
    }

    if (copyPerson === undefined) {
      numberService
        .create(personObject)
        .then(returnedNote => {
          props.setPersons(props.persons.concat(returnedNote))
          props.setNewName('')
          props.setNewNumber('')
        })
    } 
  }

  return (
    <div>
      <form onSubmit={addPerson}>
        <div>
          name: <input value = {props.newName} onChange = {handleNameChange} />
          <br/>
          number: <input value = {props.newNumber} onChange = {handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  )
}

const Persons = (props) => {
  const handleButtonClick = event => {
    if (window.confirm(`Delete ${event.target.name}`)) {
      numberService.deletePerson(event.target.id)
      let new_array = []
      props.persons.forEach(item => {
        if (item.id != event.target.id) {
          new_array.push(item)
        }
      })
      props.setPersons(new_array)
    }
  }
  
  const numberList = props.persons.map(person => 
    person.name.toLowerCase().includes(props.newFilter.toLowerCase())
    ? 
    <p key = {person.id}>
      {person.name} {person.number} <button name = {person.name} id = {person.id} onClick={handleButtonClick}>delete</button>
    </p> 
    : 
    <p key = {person.id}/> 
  )

  return (
    <div>
      { numberList }
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  
  useEffect(() => {
    axios
        .get('http://localhost:3001/persons')
        .then(response => {
          setPersons(response.data)
        })
  }, [])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  
  return (
    <div>
      <h2>Phonebook</h2>
      
      <Filter 
        setNewFilter = {setNewFilter}
      />

      <h3>add a new </h3>

      <PersonForm 
        persons = {persons} 
        setPersons = {setPersons}
        newName = {newName} 
        setNewName = {setNewName} 
        newNumber = {newNumber} 
        setNewNumber = {setNewNumber}
      />

      <h3>Numbers</h3>

      <Persons 
        persons = {persons}
        setPersons = {setPersons}
        newFilter = {newFilter}
        />
    </div>
  )
}

export default App
