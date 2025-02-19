// index.js

const express = require('express');
const app = express();

app.use(express.json());

let persons = [
    { 
      id: "1",
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: "2",
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      id: "3",
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    { 
      id: "4",
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
];

app.get('/', (request, response) => {
    response.send('<h1>Phonebook Backend</h1>');
});

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.get('/api/info', (request, response) => {
    const currentTime = new Date();
    const info = `
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${currentTime}</p>
    `;
    response.send(info);
});

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const person = persons.find(p => p.id === id);

    if (person) {
        response.json(person);
    } else {
        response.status(404).send({ error: 'Person not found' });
    }
});

// New route handler for adding a person
app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({ error: 'Name or number is missing' });
    }

    const nameExists = persons.some(person => person.name === body.name);
    if (nameExists) {
        return response.status(400).json({ error: 'Name must be unique' });
    }

    const newPerson = {
        id: generateId(),
        name: body.name,
        number: body.number,
    };

    persons = persons.concat(newPerson);
    response.json(newPerson);
});

// Function to generate a unique ID
const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(p => Number(p.id)))
        : 0;
    return String(maxId + 1);
};

const port = 3001;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
