import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'

const Filter = ({ toSearch, handleToSearch }) => (
  <div>
    filter shown with <input value={toSearch} onChange={handleToSearch}></input>
  </div>
)

const PersonForm = ({addPerson, newName, handlePersonChange, newNumber, handleNumberChange}) => (
  <form onSubmit={addPerson}>
    <div>
      name: <input value={newName} onChange={handlePersonChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Person = ({ person, handleDelete }) => (
  <li>
    {person.name} {person.number}
    <button 
      style={{ marginLeft: '10px' }}
      onClick={() => handleDelete(person.id, person.name)} 
    >
      delete
    </button>
  </li>
)

const Persons = ({ personsToShow, handleDelete }) => (
  <ul>
    {personsToShow.map(person => (
      <Person key={person.id} person={person} handleDelete={handleDelete} />
    ))}
  </ul>
)

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [toSearch, setToSearch] = useState('')
  const [notification, setNotification] = useState({ message: null, type: null })

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const exists = persons.find(person => person.name.trim() === newName.trim())

    const personObject = {
      name: newName,
      number: newNumber
    }

    if (exists) {
      const confirmUpt = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )

      if (!confirmUpt) return

      personService
      .update(exists.id, personObject)
      .then(returnedPerson => {
        setPersons(persons.map(
          person => person.id !== exists.id ? person : returnedPerson
          )
        )
        setNewName('')
        setNewNumber('')
        setNotification({ message: `Updated ${returnedPerson.name}'s number`, type: 'success' })
        setTimeout(() => {
          setNotification({ message: null, type: null })
        }, 5000)
      })
      .catch(error => {
        const errorMessage =
          error.response?.data?.error || `Information of ${exists.name} has already been removed from server`
        setNotification({
          message: errorMessage, type: 'error'
        })
        setPersons(persons.filter((person) => person.id !== exists.id))
        setNewName('')
        setNewNumber('')
        setTimeout(() => {
          setNotification({ message: null, type: null })
        }, 5000)
      })

      return
    }

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setNotification({ message: `Added ${returnedPerson.name}`, type: 'success' })
        setTimeout(() => {
          setNotification({ message: null, type: null })
        }, 5000)
      })
      .catch(error => {
        setNotification({
          message: error.response.data.error,
          type: 'error'
        })
        setTimeout(() => {
          setNotification({ message: null, type: null })
        }, 5000)
      })
  }

  const handlePersonChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(toSearch.toLowerCase()))

  const handleToSearch = (event) => {
    console.log(event.target.value)
    setToSearch(event.target.value)
  }

  const handleDelete = (id, name) => {

    const confirmDel = window.confirm(`Delete ${name}?`)

    if (!confirmDel) return

    personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
      setNotification({ message: `Deleted ${name}`, type: 'success' })
      setTimeout(() => {
        setNotification({ message: null, type: null })
      }, 5000)
      })
      .catch((error) => {
        setNotification({ message: `Information of ${name} has already been removed`, type: 'error' })
        setPersons(persons.filter((person) => person.id !== id))
        setTimeout(() => {
          setNotification({ message: null, type: null })
        }, 5000)
      })
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={notification.message} type={notification.type} />

      <Filter toSearch={toSearch} handleToSearch={handleToSearch} />

      <h2>add a new</h2>
      <PersonForm 
        addPerson={addPerson} 
        newName={newName} 
        handlePersonChange={handlePersonChange} 
        newNumber={newNumber} 
        handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} handleDelete={handleDelete}/>
    </div>
  )
}

export default App