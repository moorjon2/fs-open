require('dotenv').config()
const express = require('express')
const path = require('path')
const Person = require('./models/person')

const app = express()

// Middleware
app.use(express.static('dist'))
app.use(express.json())

// Logger (optional)
app.use((req, res, next) => {
    console.log('Method:', req.method)
    console.log('Path:   ', req.path)
    console.log('Body:   ', req.body)
    console.log('---')
    next()
})

// Routes

// Get all persons
app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

// Get single person by ID
app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => {
            console.error(error)
            res.status(400).send({ error: 'malformatted id' })
        })
})

// Info route
app.get('/info', (req, res) => {
    Person.countDocuments({}).then(count => {
        const date = new Date()
        res.send(
            `<p>Phonebook has info for ${count} people</p>
       <p>${date}</p>`
        )
    })
})

// Add new person to DB
app.post('/api/persons', (req, res) => {
    const { name, number } = req.body

    if (!name || !number) {
        return res.status(400).json({ error: 'name or number missing' })
    }

    const person = new Person({
        name,
        number,
    })

    person.save()
        .then(savedPerson => {
            res.json(savedPerson)
        })
        .catch(error => {
            console.error('Error saving person:', error)
            res.status(500).json({ error: 'failed to save person' })
        })
})


// Unknown endpoint handler
app.use((req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
})

// React frontend fallback
app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
})

// Server start
const PORT = process.env.PORT || 3001
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`)
})
