const express = require('express');
const jwt = require('jsonwebtoken');
const books = require("./booksdb.js");
const regd_users = express.Router();

const users = [];

const isValid = (username) => {
  return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
}


regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ username: username }, 'fingerprint_customer');
    res.cookie('token', token); // Set the token as a cookie
    return res.status(200).json({ message: "Login successful.", token: token });
  } else {
    return res.status(401).json({ message: "Authentication failed. Invalid username or password." });
  }
});


regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  // Strange that just one space can break it, TODO: trim the key then access the value
  const { review } = req.query;
  const username = req.username;
  console.warn(req.query)
  if (!isbn || !review) {
    return res.status(400).json({ message: "ISBN is required." });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }
  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: `Review added successfully to book with ISBN ${isbn}.` });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const username = req.username;

  if (!isbn) {
    return res.status(400).json({ message: "ISBN is required." });
  }

  const book = books[isbn];
  if (!book || !book.reviews) {
    return res.status(404).json({ message: "Book or reviews not found." });
  }

  if (!book.reviews[username]) {
    return res.status(404).json({ message: "Review not found." });
  }
  delete book.reviews[username];

  return res.status(200).json({ message: "Review deleted successfully." });
});

module.exports = {
  authenticated: regd_users,
  isValid,
  users
};
