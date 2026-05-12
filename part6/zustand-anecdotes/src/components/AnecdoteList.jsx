import { useAnecdoteActions, useAnecdotes } from '../store'
import { useNotificationsActions } from '../notificationStore'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const { vote, remove } = useAnecdoteActions()
  //const filter = useFilter()
  const { setNotification } = useNotificationsActions()

  /*const anecdotesToShow = anecdotes.filter(anecdote => {
    if (filter === 'all') return true
    else return anecdote.content.toLowerCase().includes(filter.toLowerCase())
  }*/

  const addVote = async (id) => {
    const anecdote = await vote(id)
    setNotification(`You voted '${anecdote.content}'`)
    console.log('vote', id)
  }

  /*function compareVotes(a, b) {
      return b.votes - a.votes
  }*/

  return (
    <ul>
      {anecdotes
        .map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => addVote(anecdote.id)}>vote</button>
            {
                anecdote.votes === 0 && (
                    <button onClick={() => remove(anecdote.id)} >
                        delete
                    </button>
            )}
          </div>
        </div>
      ))
      }
    </ul>
  )
}

export default AnecdoteList
