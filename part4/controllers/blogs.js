const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

//Get all the blogs
blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  res.json(blogs);
});

const getTokenFrom = (req) => {
  const authorization = req.get('authorization');

  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '');
  }
  return null;
};

//Post a blog
blogsRouter.post('/', async (req, res) => {
  const body = req.body;

  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);

  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invlaid' });
  }

  const user = await User.findById(decodedToken.id);

  //if title or url props dont exist, return error code 400
  if (!body.title || !body.url) {
    return res.status(400).end();
  }

  //if likes property does not exist, default value to 0
  let likes;
  if (!body.likes) {
    likes = 0;
  } else {
    likes = body.likes;
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    user: user.id,
    url: body.url,
    likes: likes,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  res.status(201).json(savedBlog);

  // .catch((error) => next(error));
});

blogsRouter.delete('/:id', async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

blogsRouter.put('/:id', async (req, res) => {
  const body = req.body;

  let likes;
  if (!body.likes) {
    likes = 0;
  } else {
    likes = body.likes;
  }

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {
    new: true,
  });
  res.json(updatedBlog);
});

module.exports = blogsRouter;
