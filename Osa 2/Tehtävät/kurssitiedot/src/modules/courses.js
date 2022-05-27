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

export default Courses