import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  return (
    <div className="error">
      {message}
    </div>
  )
}

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
      if (copyPerson.number === props.newNumber) {
        alert(`${props.newName} is already added to phonebook`)
        return 0
      }

      if (window.confirm(`${props.newName} is already added to phonebook, replace the old number with a new one?`)) {
        const updatedPersonObject = {
          name: props.newName,
          number: props.newNumber,
          id: copyPerson.id
        }
        personService.updatePerson(copyPerson.id,updatedPersonObject)

        let new_array = []
        props.persons.forEach(item => {
          if (item.id === copyPerson.id) {
            new_array.push(updatedPersonObject)
            return
          }
          new_array.push(item)
        })
        props.setPersons(new_array)
        props.setErrorMessage(`Updated ${props.newName}'s number`)
      }
      return 0
    }

    const personObject = {
      name: props.newName,
      number: props.newNumber,
    }

    if (copyPerson === undefined) {
      personService
        .createPerson(personObject)
        .then(returnedNote => {
          props.setPersons(props.persons.concat(returnedNote))
          props.setNewName('')
          props.setNewNumber('')
          props.setErrorMessage(`Added ${personObject.name}`)
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
    if (window.confirm(`Delete ${event.target.name}?`)) {
      personService.deletePerson(event.target.id)
      let new_array = []
      props.persons.forEach(item => {
        if (item.id != event.target.id) {
          new_array.push(item)
        }
      })
      props.setPersons(new_array)
      props.setErrorMessage(`Deleted ${event.target.name}`)
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
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    axios
        .get('http://localhost:3001/persons')
        .then(response => {
          setPersons(response.data)
        })
  }, [])

  useEffect(() => {
    const timeId = setTimeout(() => {
      setErrorMessage(null)
    }, 3000)
    return () => {
      clearTimeout(timeId)
    }
  }, [errorMessage])
  
  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={errorMessage}/>
      
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
        setErrorMessage = {setErrorMessage}
      />

      <h3>Numbers</h3>

      <Persons 
        persons = {persons}
        setPersons = {setPersons}
        newFilter = {newFilter}
        setErrorMessage = {setErrorMessage}
        />
    </div>
  )
}

export default App
