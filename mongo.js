const mongoose = require('mongoose')
const Person = require('./models/person')
require('dotenv').config()

let db // Store the MongoDB client connection

const connectToDatabase = async () => {
  try {
    db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    process.exit(1)
  }
}

const addPerson = async (name, number) => {
  try {
    const person = new Person({
      name,
      number,
    })
    const savedPerson = await person.save()
    console.log(`Added ${savedPerson.name} to the phonebook`)
    return savedPerson
  } catch (error) {
    console.error('Error adding a person:', error)
    throw error
  }
}

module.exports = {
  connectToDatabase,
  addPerson,
  db, // Export the MongoDB client connection
}