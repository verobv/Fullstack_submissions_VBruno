import { useAnecdotes } from '../hooks'

const AnecdoteList = () => {

  const { anecdotes, deleteAnecdote } = useAnecdotes()

  return (
    <div>
      <h2>Anecdotes</h2>
      <ul>
        {anecdotes.map (anecdote =>
          <div key={anecdote.id}>
            <li>
              {anecdote.content}
              <button onClick={ () => deleteAnecdote(anecdote.id) }>delete</button> 
            </li>
          </div>
        )}
      </ul>
    </div>
  )
}

export default AnecdoteList
