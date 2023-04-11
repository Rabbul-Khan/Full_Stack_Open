const mongoose = require('mongoose');
const helper = require('./test_helper');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const api = supertest(app);

//before each test clear the database and add 2 blogs
beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(helper.initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(helper.initialBlogs[1]);
  await blogObject.save();
});

test('all blog posts returned in json format', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test('a specific blog is within the returned blog posts', async () => {
  const response = await api.get('/api/blogs');
  const contents = response.body.map((r) => r.title);
  expect(contents).toContain('Go To Statement Considered Harmful');
});

//By default the uniqe identifier property is "_id". This test is to ensure that the property is renamed to "id".
test('the unique identifier property is named id', async () => {
  const response = await api.get('/api/blogs');
  for (const blog of response.body) {
    expect(blog.id).toBeDefined();
  }
});

test('create a new blog post', async () => {
  const blogObject = {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  };

  await api
    .post('/api/blogs')
    .send(blogObject)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs');
  const blogs = response.body;
  const blogTitles = blogs.map((blog) => {
    return blog.title;
  });
  expect(blogTitles).toHaveLength(helper.initialBlogs.length + 1);
  expect(blogTitles).toContain('TDD harms architecture');
});

test('if likes property missing, the value is zero', async () => {
  const blogObject = {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    __v: 0,
  };

  await api
    .post('/api/blogs')
    .send(blogObject)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs');
  const blogs = response.body;
  const blog = blogs.filter((blog) => {
    return blog.title === 'First class tests';
  });
  expect(blog[0].likes).toBe(0);
});

test('if title or url missing, receive status code 400', async () => {
  const blogObject = {
    _id: '5a422bc61b54a676234d17fc',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  };
  await api.post('/api/blogs').send(blogObject).expect(400);

  const anotherBlogObject = {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    likes: 2,
    __v: 0,
  };
  await api.post('/api/blogs').send(anotherBlogObject).expect(400);

  const response = await api.get('/api/blogs');
  const blogs = response.body;
  expect(blogs.length).toBe(helper.initialBlogs.length);
});

test('Delete a blog', async () => {
  const response = await api.get('/api/blogs');
  const blogs = response.body;
  const blog = blogs[0];

  await api.delete(`/api/blogs/${blog.id}`).expect(204);

  const responseAtEnd = await api.get('/api/blogs');
  const blogsAtEnd = responseAtEnd.body;

  expect(blogsAtEnd.length).toBe(helper.initialBlogs.length - 1);

  const titles = blogsAtEnd.map((blog) => {
    return blog.title;
  });

  expect(titles).not.toContain('React patterns');
});

test('Update a blog', async () => {
  const response = await api.get('/api/blogs');
  const blogs = response.body;
  const blog = blogs[0];

  const blogObject = {
    likes: 25,
  };

  await api.put(`/api/blogs/${blog.id}`).send(blogObject).expect(200);

  const responseAtEnd = await api.get('/api/blogs');
  const blogsAtEnd = responseAtEnd.body;
  expect(blogsAtEnd.length).toBe(helper.initialBlogs.length);

  const updatedBlog = blogsAtEnd.filter((blog) => {
    return blog.id === blogsAtEnd[0].id;
  });

  expect(updatedBlog[0].likes).toBe(25);
});

afterAll(async () => {
  await mongoose.connection.close();
});
