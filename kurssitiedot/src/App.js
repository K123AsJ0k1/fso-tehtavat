const Header = (props) => {
  return (
    <div>
      <h2>{props.text}</h2>
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

const Total = (props) => {
  const total = props.parts.reduce( (total, num) => total+num.exercises,0)
  
  return(
    <div>
      <b>total of exercises {total}</b>
    </div>
  )
}

const Course = (props) => {
  return (
    <div>
      <Header text = {props.course.name} />
      <Content parts = {props.course.parts}/>
      <Total parts = {props.course.parts}/>
    </div>
  )
}

const Courses = (props) => {
  const elements = props.courses.map(course => 
    <Course key = {course.id} course = {course} />
    )
  return(
    <div>
      {elements}
    </div>
  )
}
 
const App = () => {
  const courses = [
    {
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
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return (
    <div>
      <h1>Web development curriculum</h1>
      <Courses courses = {courses} />
    </div>
  )
}

export default App