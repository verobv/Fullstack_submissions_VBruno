import { useState } from 'react'

const Title = props => <h1>{props.text}</h1>

const Button = (props) => (
  <button onClick={props.onClick}>
    {props.text}
  </button>
)

const DisplayVotes = ({selected, votes}) => (
  <div>
    {'has '}{votes[selected]}{' votes'}
  </div>
)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  const handleVotes = () => {
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
  }

  const topSelected = votes.indexOf(Math.max(...votes))

  return (
    <div>
      <Title text={'Anecdote of the day'} />
      {anecdotes[selected]}
      <DisplayVotes selected={selected} votes={votes} />
      <Button onClick={() => handleVotes()} text="vote" />
      <Button onClick={() => setSelected(getRandomInt(anecdotes.length))} text="next anecdote" />
      <Title text={'Anecdote with most votes'} />
      {anecdotes[topSelected]}
      <DisplayVotes selected={topSelected} votes={votes} />
    </div>
  )
}

export default App