import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('../services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  }
}))

import anecdotesService from '../services/anecdotes'
import useAnecdoteStore, { useAnecdotes, useAnecdoteActions } from '../store'

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], filter: '' })
  vi.clearAllMocks()
})

describe('useAnecdoteActions', () => {
  it('initialize loads anecdotes from service', async () => {
    const mockAnecdotes = [{ id: 1, content: 'Test', votes: 0 }]
    anecdotesService.getAll.mockResolvedValue(mockAnecdotes)

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.initialize()
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current).toEqual(mockAnecdotes)
  })

  it('add appends a new anecdote', async () => {
    const newAnecdote = { id: 2, content: 'New anecdote', votes: 0 }
    anecdotesService.createNew.mockResolvedValue(newAnecdote)

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.add('New anecdote')
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current).toContainEqual(newAnecdote)
  })

  it('recevies anecdotes sorted by votes', async () => {
    const anecdotes = [{ id: 3, content: 'New anecdote', votes: 0 }, { id: 4, content: 'Other new anecdote', votes: 2 }]
    useAnecdoteStore.setState({ anecdotes })  

    const { result } = renderHook(() => useAnecdotes())

    expect(result.current[0]).toEqual(anecdotes[1])
    expect(result.current[1]).toEqual(anecdotes[0])
  })

  it('voting increases votes by 1', async () => {
    const anecdote = { id: 1, content: 'Test', votes: 0 }
    useAnecdoteStore.setState({ anecdotes: [anecdote] })
    anecdotesService.update.mockResolvedValue({ ...anecdote, votes: 1 })

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.vote(1)
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current[0].votes).toBe(1)
  })
})

describe('useAnecdotes filtering', () => {
  const anecdotes = [
    { id: 1, content: 'A', votes: 0 },
    { id: 2, content: 'B', votes: 0 },
  ]

  beforeEach(() => {
    useAnecdoteStore.setState({ anecdotes })
  })

  it('returns all notes with no filter', () => {
    const { result } = renderHook(() => useAnecdotes())
    expect(result.current).toHaveLength(2)
  })

  it('filters anecdotes A', () => {
    useAnecdoteStore.setState({ anecdotes, filter: 'A' })
    const { result } = renderHook(() => useAnecdotes())
    expect(result.current).toEqual([anecdotes[0]])
  })

  it('filters anecdotes B', () => {
    useAnecdoteStore.setState({ anecdotes, filter: 'B' })
    const { result } = renderHook(() => useAnecdotes())
    expect(result.current).toEqual([anecdotes[1]])
  })
})