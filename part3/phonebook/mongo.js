const mongoose = require('mongoose')

const args = process.argv

if (args.length < 3) {
  console.log('Usage:')
  console.log('To add: node mongo.js <password> "<name>" <number>')
  console.log('To list: node mongo.js <password>')
  process.exit(1)
}

const password = args[2]

const url = `mongodb+srv://veronicabrunov_db_user:${password}@cluster0.llflcrg.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

// list or add
if (args.length === 3) {
  Person.find({}).then(persons => {
    console.log('phonebook:')
    persons.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else if (args.length === 5) {
  const name = args[3]
  const num = args[4]

  const person = new Person({ name, number: num })

  person.save().then(() => {
    console.log(`added ${name} number ${num} to phonebook`)
    mongoose.connection.close()
  })
} else {
  console.log('Incorrect number of arguments.')
  console.log('Usage:')
  console.log('To add: node mongo.js <password> "<name>" <number>')
  console.log('To list: node mongo.js <password>')
  process.exit(1)
}
