const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
require('dotenv').config()
const Person = require('./models/person')

app.use(express.static('build'))
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
    
    Person.find({})
        .then(res => {
            response.send(
                `<p>Phonebook has info for ${res.length} people</p>
                <p>${new Date().toDateString()}</p>`
        
            )
        })
})
app.get('/api/persons', (request, response) => {
    Person.find({}).then(res => response.json(res))
})
app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(res => {response.json(res)})
    
})
app.post('/api/persons', (request, response) => {
    Person.find({}).then(res => {
        const body = request.body
        const people = res
        if (people.some(p=>p.name===body.name)){
            return response.status(400).json({
                error: 'name must be unique'
            })
        }
        const person = new Person({
            name: body.name,
            number: body.number
        })
        person.save().then(res => {response.json(res)})
        

    })
})
app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id)
        .then(res => {
            response.status(204).end()
        }).catch(e=>console.log(e.message))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})