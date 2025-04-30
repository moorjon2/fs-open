const express = require('express')
const path = require('path')
const mongoose = require('mongoose')

const app = express()

const password = process.argv[2]
const url = `mongodb+srv://mfernandezm85:${password}@cluster0.emxo6rw.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('MongoDB connection error:', error.message))

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

// Formatting the object returned by mongoose
// don't return the mongo versioning field __v
noteSchema.set('toJSON', {
    transform: (document, returnObject) => {
        returnObject.id = returnObject._id.toString()
        delete returnObject._id
        delete returnObject.__v
    }
})

const Note = mongoose.model('Note', noteSchema)

// Middlewares
app.use(express.json())
app.use(express.static('dist'))

// Logger
app.use((req, res, next) => {
  console.log('Method:', req.method)
  console.log('Path:  ', req.path)
  console.log('Body:  ', req.body)
  console.log('---')
  next()
})

// GET all notes
app.get('/api/notes', (req, res) => {
  Note.find({}).then(notes => {
    res.json(notes)
  })
})

// GET note by id
app.get('/api/notes/:id', (req, res) => {
  Note.findById(req.params.id)
      .then(note => {
        if (note) {
          res.json(note)
        } else {
          res.status(404).end()
        }
      })
      .catch(error => {
        console.error(error)
        res.status(400).send({ error: 'malformatted id' })
      })
})

// POST new note
app.post('/api/notes', (req, res) => {
  const body = req.body

  if (!body.content) {
    return res.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then(savedNote => {
    res.json(savedNote)
  })
})

// DELETE note
app.delete('/api/notes/:id', (req, res) => {
  Note.findByIdAndDelete(req.params.id)
      .then(() => {
        res.status(204).end()
      })
      .catch(error => {
        console.error(error)
        res.status(400).send({ error: 'malformatted id' })
      })
})

// unknown route middleware
app.use((req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
