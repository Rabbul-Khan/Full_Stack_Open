const Course = ({ course }) => {
  return (
    <>
      <Header course={course} />
      {course.parts.map((part) => {
        return <Part key={part.id} part={part} />;
      })}
      <Total parts={course.parts} />
    </>
  );
};

const Header = ({ course }) => {
  return <h1>{course.name}</h1>;
};

const Part = ({ part }) => {
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  );
};

const Total = ({ parts }) => {
  const exercises = parts.map((part) => {
    return part.exercises;
  });
  return (
    <b>
      total of{" "}
      {exercises.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      )}{" "}
      exercises
    </b>
  );
};

export default Course;
