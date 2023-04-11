// const logger = require('./logger');

//dummy function
//input: blogs array
//output: always 1
const dummy = (blogs) => {
  const result = 1;
  return result;
};

//Function that returns the sum of all the likes of all the blogs
//input: blogs array
//output: sum of all likes
const totalLikes = (blogs) => {
  const totalLikes = blogs.reduce((total, blog) => {
    return total + blog.likes;
  }, 0);
  return totalLikes;
};

//Function that returns the blog with most likes
//input: blogs array
//output: an object with the following properties of the most liked blog:
//{title, author, number of likes}
const favoriteBlog = (blogs) => {
  let highestLikes = 0;
  let highestLikesIndex = 0;
  for (let i = 0; i < blogs.length; i++) {
    if (blogs[i].likes > highestLikes) {
      highestLikes = blogs[i].likes;
      highestLikesIndex = i;
    }
  }

  return {
    title: blogs[highestLikesIndex].title,
    author: blogs[highestLikesIndex].author,
    likes: blogs[highestLikesIndex].likes,
  };
};

//Function that returns author with highest number of blogs
//input: blogs array
//output: an object with following properties:
//{author with highest blogs, number of blogs by the author}
const mostBlogs = (blogs) => {
  let authors = {};
  let highestAuthor;

  //Create an authors object that contains all the authors and the number of blogs each author has created.
  //The key is the authors name, the value is the total number of blogs by the author
  blogs.forEach((blog) => {
    if (authors[blog.author]) {
      authors[blog.author] += 1;
    } else {
      authors[blog.author] = 1;
    }
  });

  //An array of all the authors name is made using Object.keys(authors)
  //Author with highest number of blogs is found by using reduce method on the array.
  highestAuthor = Object.keys(authors).reduce((a, b) => {
    if (authors[a] > authors[b]) {
      return a;
    } else {
      return b;
    }
  });

  return {
    author: highestAuthor,
    blogs: authors[highestAuthor],
  };
};

//Function that returns the author that has the most likes
//input: blogs array
//output: an object with following properties:
//{author with highest likes, total number of likes the author has}
const mostLikes = (blogs) => {
  let authors = {};
  let highestAuthor;

  //create an object called authors
  //each key is the name of an author, and the value is how many likes does the author have
  blogs.forEach((blog) => {
    if (authors[blog.author]) {
      authors[blog.author] += blog.likes;
    } else {
      authors[blog.author] = blog.likes;
    }
  });

  //create an array of author names with Object.keys(authors)
  //get the author with the highest number of likes using reduce method on the authors array
  highestAuthor = Object.keys(authors).reduce((a, b) => {
    if (authors[a] > authors[b]) {
      return a;
    } else {
      return b;
    }
  });

  return {
    author: highestAuthor,
    likes: authors[highestAuthor],
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
