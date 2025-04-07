const Part = ({ part }) => {
    return <p>{part.name} {part.exercises}</p>
}

const Course = ({ course }) => {
    const totalExercises = course.parts.reduce((sum, part) => sum + part.exercises, 0)

    return (
        <>
            <h2>{course.name}</h2>
            {course.parts.map(part => (
                <Part key={part.id} part={part} />
            ))}
            <p><strong>total of {totalExercises} exercises</strong></p>
        </>
    )
}

export default Course