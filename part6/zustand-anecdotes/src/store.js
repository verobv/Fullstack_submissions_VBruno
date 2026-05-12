
import { create } from 'zustand'
import anecdotesService from './services/anecdotes'

/*const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = anecdote => ({
  content: anecdote,
  id: getId(),
  votes: 0
})*/

const useAnecdoteStore = create((set, get) => ({
  anecdotes:  [],
  filter: 'all',
  actions: {
    add: async (anecdote) => {
      const newAnecdote = await anecdotesService.createNew(anecdote)
      set(state => ({ anecdotes: state.anecdotes.concat(newAnecdote)}))
    },
    vote: async (id) => {
      const anecdote = get().anecdotes.find(a => a.id === id)
      const updated = await anecdotesService.update(
        id, { ...anecdote, votes: anecdote.votes + 1 }
      )
      set(state => ({
        anecdotes: state.anecdotes.map(a => a.id === id ? updated : a)
      }))
      return updated
    },
    setFilter: value => set(() => ({ filter: value })),
    initialize: async () => {
      const anecdotes = await anecdotesService.getAll()
      set(() => ({ anecdotes }))
    },
    remove: async (id) => {
      await anecdotesService.remove(id)
      set(state => ({
        anecdotes: state.anecdotes.filter(a => a.id !== id)
      }))
    }
  },
}))

export const useAnecdotes = () => {
  const anecdotes =
    useAnecdoteStore((state) => state.anecdotes)

  const filter =
    useAnecdoteStore((state) => state.filter)

  const filtered =
    filter === 'all' || filter === ''
      ? anecdotes
      : anecdotes.filter(anecdote =>
          anecdote.content
            .toLowerCase()
            .includes(filter.toLowerCase())
        )

  return filtered.toSorted(
    (a, b) => b.votes - a.votes
  )
}
export const useFilter = () => useAnecdoteStore((state) => state.filter)
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)

export default useAnecdoteStore