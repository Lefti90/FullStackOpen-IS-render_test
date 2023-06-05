const express = require('express')
const app = express()
const cors = require('cors')
const { ObjectId } = require('mongoose').Types; // Import ObjectId
const Person = require('./models/person')
const { connectToDatabase, addPerson } = require('./mongo')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

// POST
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'Name or number missing' })
  }

  addPerson(body.name, body.number)
    .then((savedPerson) => {
      response.json(savedPerson)
    })
    .catch((error) => next(error))
})

// GET
app.get('/api/persons/:id', (request, response, next) => {
  const id = Number(request.params.id)
  console.log('GET started')

  Person.findById(id)
    .then((person) => {
      if (person) {
        console.log('Persons:', person)
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.get('/api/persons', (req, res) => {
  Person.find({})
    .then((persons) => {
      res.json(persons)
    })
    .catch((error) => next(error))
})

// DELETE
app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  if (!ObjectId.isValid(id)) {
    return response.status(400).json({ error: 'Invalid ID' })
  }

  Person.findByIdAndRemove(id)
    .then((deletedPerson) => {
      if (deletedPerson) {
        response.status(204).end()
      } else {
        response.status(404).json({ error: 'Person not found' })
      }
    })
    .catch((error) => next(error))
})

// SERVER
const port = process.env.PORT || 3001

connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })
  })
  .catch((error) => {
    console.error('Error connecting to database:', error)
    process.exit(1)
  })