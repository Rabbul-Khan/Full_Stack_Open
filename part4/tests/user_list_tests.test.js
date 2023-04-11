const mongoose = require('mongoose');
const helper = require('./test_helper');
const supertest = require('supertest');
const app = require('../app');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const api = supertest(app);

describe('when there is initially one user in the db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('secret', 10);
    const user = new User({
      username: 'root',
      name: 'root ed',
      passwordHash: passwordHash,
    });

    await user.save();
  });

  test('creation succeeds with a unique username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'khan',
      name: 'Rabbul Khan',
      password: '123456',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1);

    const userNames = usersAtEnd.map((user) => {
      return user.username;
    });
    expect(userNames).toContain(newUser.username);
  });

  test('creation fails if username is not unique', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'Rabbul Khan',
      password: '123456',
    };

    await api.post('/api/users').send(newUser).expect(400);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd.length).toBe(usersAtStart.length);
  });

  test('receive error code 400, if username is too short', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'ab',
      name: 'Rabbul Khan',
      password: '123456',
    };

    await api.post('/api/users').send(newUser).expect(400);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd.length).toBe(usersAtStart.length);
  });

  test('receive error code 400, if password is too short', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'ab',
      name: 'Rabbul Khan',
      password: '12',
    };

    await api.post('/api/users').send(newUser).expect(400);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd.length).toBe(usersAtStart.length);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
