const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (isValid(username)) {
      users.push({ username, password });
      return res.status(200).json({ message: "User successfully registered." });
    }
    return res.status(404).json({ message: "User already exists." });
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    const fetchBooks = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(books);
        }, 1000);
      });
    };
    const booksList = await fetchBooks();
    return res.status(200).json(booksList);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books." });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  try {
    const fetchBookByISBN = (isbn) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (books[isbn]) {
            resolve(books[isbn]);
          } else {
            reject("Book not found.");
          }
        }, 1000);
      });
    };
    const isbn = req.params.isbn;
    const book = await fetchBookByISBN(isbn);
    return res.status(200).send(book);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  try {
    const fetchBooksByAuthor = (author) => {
      return new Promise((resolve) => {
        setTimeout(() => {
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
          resolve(booksByAuthor);
        }, 1000);
      });
    };
    const author = req.params.author;
    const foundBooks = await fetchBooksByAuthor(author);
    return res.status(200).json(foundBooks);
  } catch (error) {
    return res.send(500).json({ message: "Error fetching books by author." });
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  try {
    const fetchBooksByTitle = (title) => {
      return new Promise((resolve) => {
        setTimeout(() => {
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
          resolve(booksByTitle);
        }, 1000);
      });
    };
    const title = req.params.title;
    const foundBooks = await fetchBooksByTitle(title);
    return res.status(200).json(foundBooks);
  } catch (error) {
    return res.send(500).json({ message: "Error fetching books by title." });
  }
});

// Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(books[isbn].reviews);
  }
  return res.status(404).json({ message: "Book not found." });
});

module.exports.general = public_users;
