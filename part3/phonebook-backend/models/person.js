const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

console.log('connecting to', url);

mongoose
  .connect(url)
  .then((result) => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: (v) => {
        let containsDash = false;
        let dashCount = 0;
        //check if the number contains a "-" and count number of "-"
        for (let i = 0; i < v.length; i++) {
          if (v[i] === '-') {
            containsDash = true;
            dashCount++;
          }
        }
        //if more than one "-" in number
        if (dashCount > 1) {
          return false;
        }

        //if number does not contain "-"
        if (!containsDash) {
          //check if all chars are only numbers
          if (Number(v)) {
            return true;
          } else {
            return false;
          }
        }

        if (containsDash) {
          const numberParts = v.split('-');
          //check if first part has only 2 or 3 chars
          if (numberParts[0].length < 2 || numberParts[0].length > 3) {
            return false;
          }
          //check both parts contain only numbers
          if (Number(numberParts[0]) || Number(numberParts[1])) {
            return true;
          }
        }
      },
      message: 'Correct format not provided',
    },
  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);
