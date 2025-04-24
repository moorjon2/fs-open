const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms :body',)
)

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

// when someone's request this url for example
// www.example.com/api/persons
// they get the persons array
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// this one just shows the persons array size
// and the date
app.get('/info', (request, response) => {
    const date = Date()
    response.send(
        `
                <p>Phonebook has info for ${persons.length} people</p>
                <p>${date}</p>
        `
    )
})

// this request only shows one person from the persons array
// if the id doesn't exist they get a 404 error
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

// this request deletes the specified person with its associated ID
// from the array
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

// helper function for the POST request
// this function generates an ID based on the size of the array + 1
const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(person => Number(person.id)))
        : 0
    return String(maxId + 1)
}

// this request adds a new person to the persons array
// it uses the generateId function to assign an ID to the person
// being added if the request succeeds
app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    if (persons.some(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)

    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})