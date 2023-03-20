import axios from "axios";
const baseUrl = "http://localhost:3001/persons";

const getAll = () => {
  return axios.get(baseUrl);
};

const getPerson = (id) => {
  return axios.get(`${baseUrl}/${id}`);
};

const addPerson = (personObject) => {
  return axios.post(baseUrl, personObject);
};

const deletePerson = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
};

const updatePerson = (personExists, newNumber) => {
  return axios.put(`${baseUrl}/${personExists.id}`, {
    ...personExists,
    number: newNumber,
  });
};

const noteService = {
  getAll: getAll,
  addPerson: addPerson,
  deletePerson: deletePerson,
  getPerson: getPerson,
  updatePerson: updatePerson,
};

export default noteService;
