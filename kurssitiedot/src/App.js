const Header = (props) => {
  return (
    <div>
      <h1>{props.text}</h1>
    </div>
  )
}

const Part = (props) => {
  return (
    <div>
      <p>{props.name} {props.exercises}</p>
    </div>
  )
}

const Content = (props) => {
  const elements = props.parts.map(part => 
    <Part key={part.id} name = {part.name} exercises = {part.exercises}/>
  )
  
  return (
    <div>
      {elements}
    </div>
  )
}

const Course = (props) => {
  return (
    <div>
      <Header text = {props.course.name} />
      <Content parts = {props.course.parts}/>
    </div>
  )
}
{/* 
const Total = (props) => {
  return(
    <div>
      <p>Number of exercises {props.parts[0].exercises + props.parts[1].exercises + props.parts[2].exercises}</p>
    </div>
  )
}
*/}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    id: 1,
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }

  return (
    <div>
      <Course course={course} />
    </div>
  )
}

export default App