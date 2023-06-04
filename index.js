const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('build'))

const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

//POST
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    console.log(body)
    return response.status(400).json({
      error: 'content missing',
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(result => {
      console.log(`Added ${body.name} to the phonebook`)
      response.json(result)
    })
    .catch(error => {
      console.log('Error saving the person:', error)
      response.status(500).json({ error: 'An error occurred while saving the person' })
    })
})

//GET
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)

  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log('Error retrieving the person:', error)
      response.status(500).json({ error: 'An error occurred while retrieving the person' })
    })
})

app.get('/api/persons', (req, res) => {
  Person.find({})
    .then(persons => {
      res.json(persons)
    })
    .catch(error => {
      console.log('Error retrieving persons:', error)
      res.status(500).json({ error: 'An error occurred while retrieving persons' })
    })
})

//DELETE
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)

  Person.findByIdAndRemove(id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => {
      console.log('Error deleting the person:', error)
      response.status(500).json({ error: 'An error occurred while deleting the person' })
    })
})

//SERVER
const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})