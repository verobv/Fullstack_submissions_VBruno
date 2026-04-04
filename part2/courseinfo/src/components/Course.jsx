const Header = (props) => <h2>{props.course}</h2>

const Content = ({part}) => (
  <div>
    <Part part={part} />
  </div>
)

const Part = (props) => (
  <p>
    
    {props.part.name} {props.part.exercises}
  </p>
)

const Total = (props) => <b>Number of exercises {props.total}</b>

const Course = ({course}) => {
  const total = course.parts.reduce((acc, curr) => acc + curr.exercises, 0)
  return (
    <div>
      <Header course={course.name} />
      {course.parts.map(part => 
        <Content key={part.id} part={part} />
      )}
      <Total total={total} />
    </div>
  )
}

export default Course