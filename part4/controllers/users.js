const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.post('/', async (req, res) => {
  if (!req.body.password) {
    return res.status(400).send({ error: 'No password given' });
  }

  if (req.body.password.length < 3) {
    return res.status(400).send({ error: 'The password is too short' });
  }

  const usernameExists = await User.find({ username: req.body.username });
  if (usernameExists.length !== 0) {
    return res.status(400).send({ error: 'The name must be unique' });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(req.body.password, saltRounds);

  const user = new User({
    username: req.body.username,
    name: req.body.name,
    passwordHash: passwordHash,
  });

  const savedUser = await user.save();

  res.status(201).json(savedUser);
});

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    url: 1,
    author: 1,
  });
  res.json(users);
});

module.exports = usersRouter;
