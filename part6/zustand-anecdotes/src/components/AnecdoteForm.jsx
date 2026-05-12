import { useAnecdoteActions } from '../store'
import { useNotificationsActions } from '../notificationStore'

const AnecdoteForm = () => {
  const { add } = useAnecdoteActions()
  const { setNotification } = useNotificationsActions()

  const addAnecdote = async (e) => {
    e.preventDefault()
    const content = e.target.note.value
    await add( content )
    setNotification(`You added '${content}'`)
    e.target.reset()
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="note" />
        </div>
          <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
