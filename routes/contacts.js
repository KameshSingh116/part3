const express = require('express')
const Contact = require('../models/contacts')
const router = express.Router()

router.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Contact.findByIdAndRemove(id)
    .then(result => {
      if (result) {
        res.status(204).end()
      } else {
        res.status(404).send({ error: 'Contact not found' })
      }
    })
    .catch(error => next(error))
})

module.exports = router