const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios').default;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Username and password are required." });

  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists." });
  }
  users.push({ username, password })
  return res.status(201).json({ message: "User registered successfully." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.json(books)
});

// Get the book list available in the shop using Axios
const getBookList = async (req, res) => {
  try {
    const response = await axios.get('https://5000-kumja1-expressbookrevie-xrcs4p82oac.ws-us110.gitpod.io/')
    const books = response.data;
    return res.json(books);
  } catch (error) {
    console.error('Error fetching book list:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  };
};

// Get book details based on ISBN using Axios
const getBookByISBN = async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`https://5000-kumja1-expressbookrevie-xrcs4p82oac.ws-us110.gitpod.io/isbn/${isbn}`);
    const book = response.data;
    return res.json(book);
  } catch (error) {
    console.error('Error fetching book by ISBN:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getBookByAuthor = async (req, res) => {
  try {
    const author = req.params.author;
    const response = await axios.get(`https://5000-kumja1-expressbookrevie-xrcs4p82oac.ws-us110.gitpod.io/author/${author}`);
    const bookDetails = response.data;
    return res.json(bookDetails);
  } catch (error) {
    console.error('Error fetching book details by author:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get book details based on title using Axios
const getBookByTitle = async (req, res) => {
  try {
    const title = req.params.title;
    const response = await axios.get(`https://5000-kumja1-expressbookrevie-xrcs4p82oac.ws-us110.gitpod.io/title/${title}`);
    const bookDetails = response.data;
    return res.json(bookDetails);
  } catch (error) {
    console.error('Error fetching book details by title:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const { isbn } = req.params;
  const bookDetails = books[Number(isbn)]
  return res.json(bookDetails)
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const { author } = req.params;
  const matches = Object.values(books).filter(book => book.author === author)
  const bookDetails = matches.length > 1 ? matches : matches[0]
  return res.json(bookDetails)
});

public_users.get('/title/:title', function (req, res) {
  const { title } = req.params;
  const bookDetails = Object.values(books).find(book => book.title === title)
  return res.json(bookDetails);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const { isbn } = req.params;
  const bookReviews = books[Number(isbn)].reviews
  return res.json(bookReviews)
});

module.exports.general = public_users;
