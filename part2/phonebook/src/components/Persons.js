import Person from "./Person";

const Persons = ({ personsToShow, deletePerson }) => {
  return (
    <div>
      {personsToShow.map((person) => {
        return (
          <Person
            key={person.name}
            person={person}
            deletePerson={deletePerson}
          />
        );
      })}
    </div>
  );
};

export default Persons;
