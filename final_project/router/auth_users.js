const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  const foundUser = users.find((user) => user.username === username);
  return foundUser ? false : true;
};

const authenticatedUser = (username, password) => {
  const foundUser = users.find(
    (user) => user.username === username && user.password === password
  );
  return foundUser ? true : false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign({ data: password }, "access", {
        expiresIn: 60 * 60,
      });
      req.session.authorization = {
        accessToken,
        username,
      };
      return res.status(200).json({ message: "User successfully logged in." });
    }
    return res
      .status(404)
      .json({ message: "Invalid Login. Check username and password." });
  }
  return res.status(404).json({ message: "Error logging in." });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
