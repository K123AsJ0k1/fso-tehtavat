import { useState } from 'react'

const Heading = (props) => {
  return(
    <h1>{props.text}</h1>
  )
}

const Button = (props) => {
  return(
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  )
}

const MostVotes = (props) => {
  let index = 0
  let value = props.points[0]
  let final_index = 0
  let all_zeros = true
  
  props.points.forEach(num => {
    if (num > 0) {
      all_zeros = false
    }
    if (num > value) {
      value = num
      final_index = index
    }
    index += 1
  })
  
  if (all_zeros) {
    return(
      <div>
        No votes yet.
      </div>
    )
  }
  
  return (
    <div>
      {props.anecdotes[final_index]}
      <br/>
      has {props.points[final_index]} votes
      <br/>
    </div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]

  const [points, setPoints] = useState(new Array(anecdotes.length).fill(0))
 
  const [selected, setSelected] = useState(Math.floor(Math.random()*anecdotes.length))

  const randomNumber = () => {
    setSelected(Math.floor(Math.random()*anecdotes.length))
  }

  const increasePoint = () => {
    const copy = [...points]
    copy[selected] += 1
    setPoints(copy)
  }

  return (
    <div>
      <Heading text = "Anecdote of the day" />
      {anecdotes[selected]}
      <br/>
      has {points[selected]} votes
      <br/>
      <Button handleClick = {increasePoint} text = "vote"/>
      <Button handleClick = {randomNumber} text = "next anecdote"/>
      <Heading text = "Anecdote with most votes" />
      <MostVotes anecdotes = {anecdotes} points = {points}/>
    </div>
  )
}

export default App
