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
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person.toJSON())
              } else {
                response.status(404).end()
              }
        })
        .catch(error => next(error))
        
})
app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const person = {
      name: body.name,
      number: body.number
    }
  
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
      .then(updatedObj => {
        response.json(updatedObj)
      })
      .catch(error => next(error))
})
app.post('/api/persons', (request, response, next) => {
    Person.find({}).then(res => {
        const body = request.body
        // const people = res
        // if (people.some(p=>p.name===body.name)){
        //     return response.status(400).json({
        //         error: 'name must be unique'
        //     })
        // }
        const person = new Person({
            name: body.name,
            number: body.number
        })
        person.save()
            .then(res => {response.json(res)})
            .catch(err => next(err))
    })
})
app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id)
        .then(res => {
            response.status(204).end()
        }).catch(e=>console.log(e.message))
})
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)
  
const errorHandler = (error, request, response, next) => {
    // console.error(error.message)
    console.log(typeof error)

    if (error.name === 'CastError' && error.kind == 'ObjectId') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json(error)
    }

    next(error)
}
  
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})