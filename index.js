const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res),
      'ms',
      JSON.stringify(req.body)
    ].join(' ')
}))

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
    const body = request.body
    const id = Math.floor(Math.random()*1000+1)
    
    if (!body.name) {
        return response.status(400).json({ 
          error: 'name missing' 
        })
    } else if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    } else if (persons.some(p=>p.name===body.name)){
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    
    const person = {
        name: body.name,
        number: body.number,
        id: id
    }
    persons = persons.concat(person)
    console.log(person)

    response.json(person)
})
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter( p => p.id !== id)

    response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})