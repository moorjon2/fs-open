const express = require('express')
const path = require('path')
const app = express()

let notes = [
  {
    id: '1',
    content: 'HTML is easy',
    important: true,
  },
  {
    id: '2',
    content: 'Browser can execute only JavaScript',
    important: false,
  },
  {
    id: '3',
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true,
  },
]

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)
app.use(express.static('dist')) // ✅ Serve built React files
app.use(express.json())

// ✅ API routes
app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
  const id = req.params.id
  const note = notes.find(note => note.id === id)

  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
})

app.post('/api/notes', (req, res) => {
  const body = req.body

  if (!body.content) {
    return res.status(400).json({ error: 'content missing' })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: String(Math.max(...notes.map(n => Number(n.id))) + 1),
  }

  notes = notes.concat(note)
  res.json(note)
})

app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id
  notes = notes.filter(note => note.id !== id)
  res.status(204).end()
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// ✅ Serve React app for all unmatched routes (must be last!)
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
