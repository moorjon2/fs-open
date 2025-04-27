import {useEffect, useState} from 'react'
import axios from 'axios'
import Filter from './components/Filter.jsx'
import PersonForm from "./components/PersonForm.jsx";
import Persons from "./components/Persons.jsx";
import Notification from './components/Notification.jsx'
import newContactService from "./services/contact.js"

const App = () => {
    const [persons, setPersons] = useState([])

    const hook = () => {
        console.log('effect')
        axios
            .get('http://localhost:3001/api/persons')
            .then(response => {
                console.log('promise fulfilled');
                setPersons(response.data)
            })
    }

    useEffect(hook, [])

    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filter, setFilter] = useState('')
    const [message, setMessage] = useState(null)

    const addPerson = (event) => {
        event.preventDefault()
        const personObj = {
            name: newName,
            number: newNumber,
        }

        const existingPerson = persons.find((person) => person.name === personObj.name)

        if (!existingPerson) {
            setPersons(persons.concat(personObj))
            setNewName('')
            setNewNumber('')
        } else {
            alert(`${personObj.name} is already in the phonebook`)
        }

        newContactService
            .create(personObj)
            .then((returnedContact) => {
                setPersons(persons.concat(returnedContact))
                setNewName('')
                setNewNumber('')
                setMessage(`Added ${returnedContact.name}`)
                setTimeout(() => {
                    setMessage(null)
                }, 5000)
        })
            .catch((error) => {
                console.error(`Error adding contact: ${error}`)
            })

    }

    const handleNewName = event => setNewName(event.target.value)
    const handleNewNumber = event => setNewNumber(event.target.value)
    const handleFilter = event => setFilter(event.target.value)

    const filteredPersons = persons.filter(person =>
        person.name.toLowerCase().includes(filter.toLowerCase())
    )

    const handleDelete = (id) => {
        const person = persons.find(person => person.id === id)

        if(window.confirm( `Delete ${person.name} ?` )) {
            newContactService.remove(id).then(() => {
                setPersons(persons.filter(person => person.id !== id))
            })
        }
    }

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification message={message} />
            <Filter filter={filter} handleFilter={handleFilter} />
            <h3>Add a new contact</h3>
            <PersonForm addPerson={addPerson} newName={newName} newNumber={newNumber} handleNewName={handleNewName} handleNewNumber={handleNewNumber} />
            <h3>Contacts</h3>
            <Persons filteredPersons={filteredPersons} handleDelete={handleDelete} />
        </div>
    )
}

export default App
