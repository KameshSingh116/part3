const mongoose = require('mongoose')

// if (process.argv.length < 3) {
//   console.log('give password as argument')
//   process.exit(1)
// }

require('dotenv').config()
const name = process.argv[3]
const number = process.argv[4]
const url ='mongodb+srv://kameah26:qwertyuiop@cluster0.djilz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

mongoose.set('strictQuery', false)

mongoose.connect(url).then(() => {
  console.log('connected to MongoDB')
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error.message)
})

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Contact = mongoose.model('Contact', contactSchema)

if (process.argv.length === 3) {
  Contact.find({}).then((result) => {
    console.log('phonebook:')
    result.forEach((contact) => {
      console.log(`${contact.name} ${contact.number}`)
    })
    mongoose.connection.close()
  })
  return
}

const contact = new Contact({
  name: process.argv[3],
  number: number,
})

contact.save()
  .then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
  .catch((error) => {
    console.error('Error saving contact:', error.message)
    mongoose.connection.close()
  })
