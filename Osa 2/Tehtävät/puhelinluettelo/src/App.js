import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'

const Notification = (props) => {
  if (props.messageType == 1) {
    return (
      <div className="success">
        {props.message}
      </div>
    )
  }
  if (props.messageType == 2) {
    return (
      <div className="failure">
        {props.message}
      </div>
    )
  }
  return null
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
        
        let update_failed = false
        personService
          .updatePerson(copyPerson.id,updatedPersonObject)
          .catch(error => {
            update_failed = true
            props.setPersons(props.persons.filter(n => n.id !== copyPerson.id))
            props.setMessage(`Information of ${props.newName} has already been removed from server`)
            props.setMessageType(2)
          })
        
        if (!update_failed) {
          let new_array = []
          props.persons.forEach(item => {
            if (item.id === copyPerson.id) {
              new_array.push(updatedPersonObject)
              return
            }
            new_array.push(item)
          })
          props.setPersons(new_array)
          props.setMessage(`Updated ${props.newName}'s number`)
          props.setMessageType(1)
        } 
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
          props.setMessage(`Added ${personObject.name}`)
          props.setMessageType(1)
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
      props.setMessage(`Deleted ${event.target.name}`)
      props.setMessageType(1)
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
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(0)

  useEffect(() => {
    axios
        .get('http://localhost:3001/persons')
        .then(response => {
          setPersons(response.data)
        })
  }, [])

  useEffect(() => {
    const timeId = setTimeout(() => {
      setMessage(null)
      setMessageType(0)
    }, 5000)
    return () => {
      clearTimeout(timeId)
    }
  }, [message])
  
  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} messageType = {messageType}/>
      
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
        setMessage = {setMessage}
        setMessageType = {setMessageType}
      />

      <h3>Numbers</h3>

      <Persons 
        persons = {persons}
        setPersons = {setPersons}
        newFilter = {newFilter}
        setMessage = {setMessage}
        setMessageType = {setMessageType}
        />
    </div>
  )
}

export default App
