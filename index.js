const express = require('express')
const app = express()

app.use(express.json())

let persons = [
    {
        id: 1,
        name: "Arton Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-23"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]
app.get('/info',(request, response) => {
    response.send(
        `<p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>`

    )
})
app.get('/api/persons', (request, response) => {
    response.json(persons)
})
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find( p => p.id === id)

    if(person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
    
})
app.post('/api/persons', (request, response) => {
    const id = Math.floor(Math.random()*1000+1)
    const person = request.body
    person.id = id
    persons = persons.concat(person)
    console.log(person)

    response.json(person)
})
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter( p => p.id !== id)

    response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})