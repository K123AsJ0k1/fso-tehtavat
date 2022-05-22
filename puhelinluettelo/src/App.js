import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ]) 
  
  const [newName, setNewName] = useState('')

  const [newNumber, setNewNumber] = useState('')

  const [newFilter, setNewFilter] = useState('')
  
  const addPerson = (event) => {
    event.preventDefault()

    const copyPerson = persons.find(person => person.name === newName)
    
    if (!(copyPerson === undefined)) {
      alert(`${newName} is already added to phonebook`)
      return 0
    }

    const personObject = {
      name: newName,
      number: newNumber,
    }

    if (copyPerson === undefined) {
      setPersons(persons.concat(personObject))
      setNewName('')
      setNewNumber('')
    } 

  }

  const numberList = persons.map(person => 
    person.name.toLowerCase().includes(newFilter.toLowerCase())
    ? 
    <p key = {person.name}>
      {person.name} {person.number}
    </p> 
    : 
    <p key = {person.name}/> 
  )

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      filter show with
      <input onChange = {handleFilterChange}/>
      <h2>add a new </h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value = {newName} onChange = {handleNameChange} />
          <br/>
          number: <input value = {newNumber} onChange = {handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      { numberList }
    </div>
  )

}

export default App
