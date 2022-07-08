import React from 'react';
import ReactDOM from 'react-dom/client'
import { createStore } from 'redux'
import reducer from './reducer'

const store = createStore(reducer)

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

const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
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
        <table>
          <tbody>
            <StatisticLine text = "good" value = {good}/>
            <StatisticLine text = "neutral" value = {neutral}/>
            <StatisticLine text = "bad" value = {bad}/>
            <StatisticLine text = "all" value = {countAll()}/>
            <StatisticLine text = "average" value = {average()}/>
            <StatisticLine text = "positive" value = {positive()}/>
          </tbody>
        </table>
    </div>
  )
}

const App = () => {
  const goodAction = () => {
    store.dispatch({
      type: 'GOOD'
    })
  }

  const okAction = () => {
    store.dispatch({
      type: 'OK'
    })
  }

  const badAction = () => {
    store.dispatch({
      type: 'BAD'
    })
  }

  const zeroAction = () => {
    store.dispatch({
      type: 'ZERO'
    })
  }
  
  return (
    <div>
      <Heading heading = "give feedback"/>
      <Button handleClick = {goodAction} name = "good"/>
      <Button handleClick = {okAction} name = "ok"/>
      <Button handleClick = {badAction} name = "bad"/>
      <Button handleClick = {zeroAction} name = "reset stats"/>
      <Heading heading = "statistics"/>
      <Statistics good = {store.getState().good} neutral = {store.getState().ok} bad = {store.getState().bad}/>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
const renderApp = () => {
  root.render(<App />)
}

renderApp()
store.subscribe(renderApp)
