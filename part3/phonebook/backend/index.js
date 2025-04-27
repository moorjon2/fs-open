const express = require('express')
const app = express()
const path = require('path')

// Serve static files first
app.use(express.static('dist'))

// Body parser
app.use(express.json())

// Setup Morgan correctly
// const morgan = require('morgan')
// morgan.token('body', (req) => JSON.stringify(req.body))
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
]

// API routes
app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    const date = new Date()
    res.send(
        `<p>Phonebook has info for ${persons.length} people</p>
         <p>${date}</p>`
    )
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(p => p.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name) {
        return res.status(400).json({ error: 'name missing' })
    }
    if (!body.number) {
        return res.status(400).json({ error: 'number missing' })
    }
    if (persons.some(p => p.name === body.name)) {
        return res.status(400).json({ error: 'name must be unique' })
    }

    const generateId = () => {
        const maxId = persons.length > 0
            ? Math.max(...persons.map(p => Number(p.id)))
            : 0
        return String(maxId + 1)
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    res.json(person)
})

// Catch-all: Serve React index.html for any other route
app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
})

// Start server
const PORT = process.env.PORT || 3001
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`)
})
