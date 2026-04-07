const express = require('express')
const app = express()

app.use(express.json())

const cors = require('cors')
app.use(cors())

const morgan = require('morgan')

app.use(morgan('tiny'))

morgan.token('body', (req) => JSON.stringify(req.body))

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

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
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/info', (request, response) => {
  const numsLen = persons.length
  const currentTime = new Date().toString()
  response.send(
    `<p>Phonebook has info for ${numsLen} people</p>
    <p>${currentTime}</p>`
  )
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const num = persons.find(num => num.id === id)

  if (num) {
    response.json(num)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(num => num.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const min = 5;
  const max = 1000000;
  return Math.floor(Math.random() * (max - min + 1)) + min
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ 
      error: 'name is missing' 
    })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'number is missing' 
    })
  }

  if (persons.some(person => person.name === body.name)) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  console.log(request.headers)
  console.log(request.body)

  response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})  