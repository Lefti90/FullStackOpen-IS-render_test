const express = require('express')
const app = express()
const cors = require('cors')
const Person = require('./models/person')
const { connectToDatabase, addPerson } = require('./mongo')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

// POST
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'Name or number missing' })
  }

  addPerson(body.name, body.number)
  response.json(body)
})

// GET
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log('GET started')

  Person.findById(id)
    .then((person) => {
      if (person) {
        console.log('Persons:', persons)
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => {
      console.error('Error finding person:', error)
      response.status(500).json({ error: 'An error occurred while finding the person' })
    })
})

app.get('/api/persons', (req, res) => {
  Person.find({})
    .then((persons) => {
      res.json(persons)
    })
    .catch((error) => {
      console.error('Error fetching persons:', error)
      res.status(500).json({ error: 'An error occurred while fetching persons' })
    })
})

// DELETE
app.delete('/api/persons/:id', (request, response) => {
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
    .catch((error) => {
      console.error('Error deleting the person:', error)
      response.status(500).json({ error: 'An error occurred while deleting the person' })
    })
})