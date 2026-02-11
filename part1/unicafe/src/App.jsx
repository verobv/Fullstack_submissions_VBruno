import { useState } from 'react'

const Title = props => <h1>{props.text}</h1>

const Button = (props) => (
  <button onClick={props.onClick}>
    {props.text}
  </button>
)

const StatisticLine = ({text, value}) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)

const Statistics = ({good, neutral, bad, all, average, positive}) => {
  if (all === 0) {
    return (
      <div>
        <Title text={'statistics'} />
        No feedback given
      </div>
    )
  }
  return (
    <div>
      <Title text="statistics" />
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={all} />
          <StatisticLine text="average" value={average} />
          <StatisticLine text="positive" value={`${positive} %`} />
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const [average, setAverage] = useState(0)
  const [positive, setPositive] = useState(0)

  const handleGood = () => {
    const newGood = good + 1
    setGood(newGood)
    const newAll = newGood + bad + neutral
    setAll(newAll)
    setAverage((newGood + -1*(bad)) / newAll)
    setPositive((newGood*100) / newAll)
  }

  const handleNeutral = () => {
    const newNeutral = neutral + 1
    setNeutral(newNeutral)
    const newAll = newNeutral + good + bad
    setAll(newAll)
    setAverage((good + -1*(bad)) / newAll)
    setPositive((good*100) / newAll)
  }

  const handleBad = () => {
    const newBad = bad + 1
    setBad(newBad)
    const newAll = newBad + good + neutral
    setAll(newAll)
    setAverage((good + -1*(newBad)) / newAll)
    setPositive((good*100) / newAll)
  }

  return (
    <div>
      <Title text={'give feedback'} />
      <Button onClick={() => handleGood()} text="good" />
      <Button onClick={() => handleNeutral()} text="neutral" />
      <Button onClick={() => handleBad()} text="bad" />
      <Statistics good={good} neutral={neutral} bad={bad} all={all} average={average} positive={positive}/>
    </div>
  )
}

export default App