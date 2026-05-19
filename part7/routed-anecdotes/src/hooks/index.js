import { useState, useEffect } from 'react'
import anecdoteService from '../services/anecdotes'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  return {
    type,
    value,
    onChange,
    reset
  }
}

// modules can have several named exports

export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([])

  useEffect(() => {
    anecdoteService
      .getAll()
      .then(anecdotes => {
        setAnecdotes(anecdotes)
      })
  }, [])

  const addAnecdote = async (anecdote) => {
    const newAnecdote = await anecdoteService.createNew(anecdote)
    await setAnecdotes(prev => prev.concat(newAnecdote))
  }

  const deleteAnecdote = async (id) => {
    await anecdoteService.remove(id)
    setAnecdotes(prev => prev.filter(a => a.id !== id))
  }

  return { anecdotes, addAnecdote, deleteAnecdote }
}