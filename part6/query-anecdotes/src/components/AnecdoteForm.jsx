import { useAnecdotes } from '../hooks/useAnecdotes'

const AnecdoteForm = () => {

  const { addAnecdote: addAnecdoteToServer } = useAnecdotes()

  /*const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
    }
  })*/

  const onCreate = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value

    /*if (content.length < 5) {
      alert('anecdote must be at least 5 characters long')
      return
    }*/

    event.target.reset()
    console.log('new anecdote')
    addAnecdoteToServer(content)
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm