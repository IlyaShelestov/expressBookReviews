const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(username);
  if (username && password) {
    if (isValid(username)) {
      users.push({ username, password });
      console.log(users);
      return res.status(200).json({ message: "User successfully registered." });
    }
    return res.status(404).json({ message: "User already exists." });
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(books[isbn]);
  }
  return res.status(404).json({ message: "Book is not found." });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const booksByAuthor = {
    booksbyauthor: [],
  };
  for (const [key, value] of Object.entries(books)) {
    if (value.author === author)
      booksByAuthor.booksbyauthor.push({
        isbn: `${key}`,
        title: value.title,
        reviews: value.reviews,
      });
  }
  return res.status(200).send(JSON.stringify(booksByAuthor, null, 4));
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const booksByTitle = {
    booksbytitle: [],
  };
  for (const [key, value] of Object.entries(books)) {
    if (value.title === title)
      booksByTitle.booksbytitle.push({
        isbn: `${key}`,
        author: value.author,
        reviews: value.reviews,
      });
  }
  return res.status(200).send(JSON.stringify(booksByTitle, null, 4));
});

// Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(books[isbn].reviews);
  }
  return res.status(404).json({ message: "Book is not found." });
});

module.exports.general = public_users;
