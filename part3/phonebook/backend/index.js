require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const errorHandler = require('./middleware/errorHandler')

const app = express()

// --- MIDDLEWARE ---
app.use(express.json())

// Request logger
const requestLogger = (req, res, next) => {
  console.log('Method:', req.method)
  console.log('Path:   ', req.path)
  console.log('Body:   ', req.body)
  console.log('---')
  next()
}
app.use(requestLogger)

// --- API ROUTES ---

// GET all contacts
app.get('/api/persons', async (req, res, next) => {
  console.log('inside /api/persons route')
  try {
    const persons = await Person.find({})
    console.log('Found persons:', persons.length)
    res.json(persons)
  } catch (error) {
    console.error('Error inside /api/persons:', error)
    next(error)
  }
})

// GET single contact by ID
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

// POST new contact
app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  const person = new Person({ name, number })

  person.save()
    .then(savedPerson => res.json(savedPerson))
    .catch(error => next(error))
})

// PUT update contact
app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  const updatedPerson = { name, number }

  Person.findByIdAndUpdate(req.params.id, updatedPerson, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then(result => res.json(result))
    .catch(error => next(error))
})

// DELETE contact
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch(error => next(error))
})

// INFO route
app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then(count => {
      const date = new Date()
      res.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${date}</p>
      `)
    })
    .catch(error => next(error))
})

// --- FRONTEND & FALLBACKS ---

// Serve frontend from /dist (after API routes)
app.use(express.static('dist'))

// Catch-all for unknown endpoints
app.use((req, res) => {
  console.log('Unmatched route reached:', req.path)
  res.status(404).send({ error: 'unknown endpoint' })
})

// Error handling middleware
app.use(errorHandler)

// Start server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
