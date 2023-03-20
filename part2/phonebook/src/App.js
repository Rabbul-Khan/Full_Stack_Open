import { useEffect, useState } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personService from "./services/persons";
import "./index.css";

const SuccessNotification = ({ successMessage }) => {
  if (successMessage === null) {
    return null;
  }
  return (
    <div className="success-notification">
      {successMessage}
      <div></div>
    </div>
  );
};

const ErrorNotification = ({ errorMessage }) => {
  if (errorMessage === null) {
    return null;
  }
  return (
    <div className="error-notification">
      {errorMessage}
      <div></div>
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filter, setFilter] = useState("");
  const [personsToShow, setPersonsToShow] = useState(persons);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  //get all the existing persons from database when page is loaded
  useEffect(() => {
    personService.getAll().then((response) => {
      setPersons(response.data);
      setPersonsToShow(response.data);
    });
  }, []);

  const addPerson = (event) => {
    //prevent the default reload on submit
    event.preventDefault();

    //if person with same name exists
    const personExists = persons.find((person) => person.name === newName);
    if (personExists) {
      //update the contact number
      if (window.confirm(`Update ${newName}?`)) {
        personService
          .updatePerson(personExists, newNumber)
          .then((response) => {
            const updatedPersons = persons.map((person) => {
              if (person.id === personExists.id) {
                person.number = newNumber;
                return person;
              } else {
                return person;
              }
            });
            setPersons(updatedPersons);
            setPersonsToShow(updatedPersons);
            setNewName("");
            setNewNumber("");
            setFilter("");
            setSuccessMessage(`${personExists.name} has been updated`);
            setTimeout(() => setSuccessMessage(null), 5000);
          })
          .catch((error) => {
            setErrorMessage(`${personExists.name} has already been removed`);
            setTimeout(() => setErrorMessage(null), 5000);
          });
      }
      return;
    }

    //add new person
    const personObject = {
      name: newName,
      number: newNumber,
    };
    personService.addPerson(personObject).then((response) => {
      setPersons(persons.concat(response.data));
      setPersonsToShow(persons.concat(response.data));
      setNewName("");
      setNewNumber("");
      setFilter("");
      setSuccessMessage(`${personObject.name} has been added`);
      setTimeout(() => setSuccessMessage(null), 5000);
    });
  };

  const deletePerson = (id, name) => {
    if (window.confirm(`Do you want to delete ${name}?`)) {
      personService.deletePerson(id).then((response) => {
        const updatedPersons = persons.filter((person) => {
          return person.id !== id;
        });
        setPersons(updatedPersons);
        setPersonsToShow(updatedPersons);
      });
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);

    if (event.target.value === "") {
      setPersonsToShow(persons);
    } else {
      setPersonsToShow(
        persons.filter((person) => {
          return person.name
            .toLowerCase()
            .includes(event.target.value.toLowerCase());
        })
      );
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <ErrorNotification errorMessage={errorMessage} />
      <SuccessNotification successMessage={successMessage} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h3>add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
