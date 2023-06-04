const mongoose = require('mongoose')
const Person = require('./models/person')
require('dotenv').config()

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('person', personSchema)

const person = new Person({
    name: name,
    number: number,
  })

person.save().then(result => {
  console.log(`Added ${name} to the phonebook`)
  mongoose.connection.close()
})

// person.find({}).then(result => {
//     result.forEach(person => {
//       console.log(person)
//     })
//     mongoose.connection.close()
//   })

