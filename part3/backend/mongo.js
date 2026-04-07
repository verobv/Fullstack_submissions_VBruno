const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://veronicabrunov_db_user:${password}@cluster0.llflcrg.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

/*const notes = [
  { content: 'HTML is easy', important: true },
  { content: 'Browser can execute only JavaScript', important: false },
  { content: 'GET and POST are the most important methods of HTTP protocol', important: true },
  { content: 'MongoDB is a NoSQL database', important: false }
]

note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})

notes.forEach(noteData => {
  const note = new Note(noteData)
  note.save().then(result => {
    console.log(`Note saved: ${note.content}`)
  }).catch(err => console.log(err))
})

setTimeout(() => mongoose.connection.close(), 1000)*/

Note.find({ important: true }).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})
