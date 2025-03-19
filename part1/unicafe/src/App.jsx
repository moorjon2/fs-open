import { useState } from 'react'

const StatisticLine = ({ text, value}) => {
  return (
    <tr>
      <td>{text}: {value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  const { goodFeed, neutralFeed, badFeed } = props
  const total = goodFeed + neutralFeed + badFeed

  return (
    <>
      <h2>statistics</h2>
      <table>
        <tbody>
          <StatisticLine text="good" value={goodFeed} />
          <StatisticLine text="neutral" value={neutralFeed} />
          <StatisticLine text="bad" value={badFeed} />
          <StatisticLine text="all" value={total} />
          <StatisticLine text="positive" value={(goodFeed/total) * 100 + " %"} />
        </tbody>
      </table>
    </>
  )
}

const Button = ({ onClick, feed }) => {
  return (
    <button onClick={onClick}>{feed}</button>
  )
}

const App = () => {
  // save click of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setneutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => setGood(good + 1)
  const handleNeutralClick = () => setneutral(neutral + 1)
  const handleBadClick = () => setBad(bad + 1)

  return (
    <div>
      <h2>give feedback</h2>
      <Button onClick={handleGoodClick} feed="good" />
      <Button onClick={handleNeutralClick} feed="neutral" />
      <Button onClick={handleBadClick} feed="bad" />

      {/* ternary conditional to display statistics only once feedback has been gathered */}
      {good !== 0 || neutral !== 0 || bad !== 0 ? (
      <Statistics goodFeed={good} neutralFeed={neutral} badFeed={bad} />
      ) : (
      <p>No feedback given</p>
      )}
    </div>
  )
}

export default App
