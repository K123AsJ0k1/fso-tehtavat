import { useState } from 'react'

const Heading = (props) => {
  return (
    <h1>{props.heading}</h1>
  )
}

const Button = (props) => {
  return (
    <button onClick={props.handleClick}>
      {props.name}
    </button>
  )
}

const Statistic = (props) => {
  return (
    <div>
        {props.name} {props.number}
        <br/>
    </div>
  )
}

const Statistics = (props) => {
  const good = props.good
  const neutral = props.neutral
  const bad = props.bad

  if (good === 0 && neutral === 0 & bad === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }

  const countAll = () => good+neutral+bad
  
  const average = () => {
    const sum = 1*good+0*neutral-1*bad
    const amount = good+neutral+bad
    return (sum/amount)
  }

  const positive = () => {
    const amount = good+neutral+bad
    return ((good/amount)*100 + " %") 
  }

  return (
    <div>
      <Statistic name = "good" number = {good}/>
      <Statistic name = "neutral" number = {neutral}/>
      <Statistic name = "bad" number = {bad}/>
      <Statistic name = "all" number = {countAll()}/>
      <Statistic name = "average" number = {average()}/>
      <Statistic name = "positive" number = {positive()}/>
    </div>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
 
  const increaseGoodByOne = () => setGood(good + 1)
  const increaseNeutralByOne = () => setNeutral(neutral + 1)
  const increaseBadByOne = () => setBad(bad + 1)
  
  return (
    <div>
      <Heading heading = "give feedback"/>
      <Button handleClick = {increaseGoodByOne} name = "good"/>      
      <Button handleClick = {increaseNeutralByOne} name = "neutral"/>
      <Button handleClick = {increaseBadByOne} name = "bad"/>  
      <Heading heading = "statistics"/>
      <Statistics good = {good} neutral = {neutral} bad = {bad}/>
    </div>
  )
}

export default App
