const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONDODB_URI

mongoose.set('strictQuery', false)

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
}).then(() => {
  console.log('connected to MongoDB')
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error.message)
})

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Contact = mongoose.model('Contact', contactSchema)

module.exports = Contact
