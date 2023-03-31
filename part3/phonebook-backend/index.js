require('dotenv').config();

const express = require('express');
const app = express();

const Person = require('./models/person');

const cors = require('cors');
app.use(cors());

const morgan = require('morgan');
app.use(express.json());
morgan.token('body', function (req, res) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.use(express.static('build'));

//Get list of existing persons
app.get('/api/persons', (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

//Info page
app.get('/info', (req, res) => {
  Person.find({}).then((persons) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`);
  });
});

//Get a certain person
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        return res.status(404).send({ error: 'The person was not found' });
      }
    })
    .catch((error) => {
      next(error);
    });
});

//Delete a certain person
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      //If person exists...delete the person
      if (result) {
        res.statusMessage = 'The person was deleted';
        return res.status(204).end();
      }
      //Else...return status - Person does not exist
      else {
        res.statusMessage = 'The person does not exist';
        return res.status(204).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

//Add a certain person
app.post('/api/persons', (req, res, next) => {
  // //If no name provided, return error
  // if (!req.body.name) {
  //   res.statusMessage = 'The name is missing';
  //   return res.status(404).send({ error: 'The name is missing' });
  // }
  // //If no number provided, return error
  // else if (!req.body.number) {
  //   res.statusMessage = 'The number is missing';
  //   return res.status(404).send({ error: 'The number is missing' });
  // }

  //Check if any person with the same name exists...
  Person.find({ name: req.body.name }).then((person) => {
    //...if exists - Error
    if (person.length !== 0) {
      res.statusMessage = 'The name must be unique';
      return res.status(404).send({ error: 'The name must be unique' });
    }
    //...if does not exist - add the person to database
    else {
      const person = new Person({
        name: req.body.name,
        number: req.body.number,
      });
      person
        .save()
        .then((savedPerson) => {
          res.json(savedPerson);
        })
        .catch((error) => {
          next(error);
        });
    }
  });
});

app.put('/api/persons/:id', (req, res, next) => {
  const person = {
    name: req.body.name,
    number: req.body.number,
  };
  Person.findByIdAndUpdate(req.params.id, person, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => {
      next(error);
    });
});

const errorHandler = (error, req, res, next) => {
  console.log(error.message);

  if (error.name === 'CastError') {
    res.status(400).send({ error: 'malformatted id' });
  }
  if (error.name === 'ValidationError') {
    res.status(400).json({ error: error.message });
  }
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
