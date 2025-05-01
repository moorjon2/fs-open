import { useEffect, useState } from 'react'
import Filter from './components/Filter.jsx'
import PersonForm from './components/PersonForm.jsx'
import Persons from './components/Persons.jsx'
import Notification from './components/Notification.jsx'
import newContactService from './services/contact.js'

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filter, setFilter] = useState('')
    const [message, setMessage] = useState(null)

    // ✅ Fetch contacts from backend on load
    useEffect(() => {
        newContactService.getAll().then(initialPersons => {
            setPersons(initialPersons)
        })
    }, [])

    // ✅ Add person handler
    const addPerson = (event) => {
        event.preventDefault()

        const personObj = {
            name: newName,
            number: newNumber,
        }

        const existingPerson = persons.find(p => p.name === personObj.name)
        if (existingPerson) {
            alert(`${personObj.name} is already in the phonebook`)
            return
        }

        newContactService
            .create(personObj)
            .then(returnedContact => {
                setPersons(persons.concat(returnedContact))
                setNewName('')
                setNewNumber('')
                setMessage(`Added ${returnedContact.name}`)
                setTimeout(() => {
                    setMessage(null)
                }, 5000)
            })
            .catch(error => {
                console.error(`Error adding contact: ${error}`)
            })
    }

    // ✅ Delete person handler
    const handleDelete = (id) => {
        const person = persons.find(p => p.id === id)
        if (window.confirm(`Delete ${person.name}?`)) {
            newContactService
                .remove(id)
                .then(() => {
                    setPersons(persons.filter(p => p.id !== id))
                })
                .catch(error => {
                    console.error(`Error deleting contact: ${error}`)
                })
        }
    }

    // ✅ Handlers for controlled inputs
    const handleNewName = (event) => setNewName(event.target.value)
    const handleNewNumber = (event) => setNewNumber(event.target.value)
    const handleFilter = (event) => setFilter(event.target.value)

    // ✅ Filtered list of persons to show
    const filteredPersons = persons.filter(person =>
        person.name.toLowerCase().includes(filter.toLowerCase())
    )

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification message={message} />
            <Filter filter={filter} handleFilter={handleFilter} />
            <h3>Add a new contact</h3>
            <PersonForm
                addPerson={addPerson}
                newName={newName}
                newNumber={newNumber}
                handleNewName={handleNewName}
                handleNewNumber={handleNewNumber}
            />
            <h3>Contacts</h3>
            <Persons
                filteredPersons={filteredPersons}
                handleDelete={handleDelete}
            />
        </div>
    )
}

export default App
