import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('dist'));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'));

morgan.token('post', function (req, res) {
    return req.method === 'POST' ? JSON.stringify(req.body) : '';
});

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

app.get('/', (request, response) => {
    response.send('<h1>Phonebook Server</h1>');
});

app.get('/api/persons', (request, response) => {
    response.json(persons);
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

app.get('/info', (request, response) => {
    const date = new Date();
    const info = `
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${date}</p>
    `;
    response.send(info);
});

app.post('/api/persons', (request, response) => {
    const newPerson = request.body;
    if (!newPerson.name || !newPerson.number) {
        return response.status(400).send({ error: 'Name or number missing' });
    } else if (persons.some(p => p.name === newPerson.name)) {
        return response.status(400).send({ error: 'Name must be unique' });
    }
    
    const id = (Math.random() * 1000).toString();
    const person = { id, ...newPerson };
    persons.push(person);
    response.status(201).json(person);
});

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    persons = persons.filter(p => p.id !== id);
    response.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});