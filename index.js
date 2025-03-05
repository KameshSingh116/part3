require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Contact = require('./models/contacts.js');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.static('dist'));
app.use(cors());
app.use(express.json());

// Morgan Logging
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

// Error Handler Middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

// Unknown Endpoint Middleware
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

// Routes

// Get all contacts
app.get('/api/persons', (req, res, next) => {
  Contact.find({})
    .then((contacts) => res.json(contacts))
    .catch(next);
});

// Get contact by ID
app.get('/api/persons/:id', (req, res, next) => {
  Contact.findById(req.params.id)
    .then((contact) => {
      if (contact) {
        res.json(contact);
      } else {
        res.status(404).end();
      }
    })
    .catch(next);
});

// Delete contact
app.delete('/api/persons/:id', (req, res, next) => {
  Contact.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch(next);
});

// Add new contact
app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: 'name or number missing' });
  }

  const newContact = new Contact({ name, number });

  newContact
    .save()
    .then((savedContact) => res.json(savedContact))
    .catch(next);
});

// Update contact
app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: 'name or number missing' });
  }

  Contact.findByIdAndUpdate(req.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
    .then((updatedContact) => {
      if (updatedContact) {
        res.json(updatedContact);
      } else {
        res.status(404).end();
      }
    })
    .catch(next);
});

// Info Route
app.get('/info', (req, res, next) => {
  Contact.countDocuments({})
    .then((count) => {
      res.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${new Date()}</p>
      `);
    })
    .catch(next);
});

app.use(unknownEndpoint);
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
