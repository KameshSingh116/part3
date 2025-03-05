require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Contact = require('./models/contacts.js');
const contactsRouter = require('./routes/contacts');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.static('dist'));
app.use(cors());
app.use(express.json());
app.use('/api/persons', contactsRouter);

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
