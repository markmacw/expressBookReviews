const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const JWT_SECRET = "fingerprint_customer";

const isValid = (username) => {
  // Check if the username is already registered
  let validusers = users.filter((user) => {
    return user.username === username;
  });
  // Return true if the username is not registered, otherwise false
  if (validusers.length > 0) {
    return false;
  } else {
    return true;
  }
};

const authenticatedUser = (username, password) => {
  // Filter the users array for any user with the same username and password
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
    req.session.token = token;
    return res
      .status(200)
      .send('Login successful for "' + username + '", Token: ' + token);
  }
  return res.status(401).send("Invalid credentials");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.body;
  if (books[isbn] === undefined) {
    return res.status(404).send("Book not found");
  } else {
    books[isbn].reviews[req.session.username] = review;
    return res
      .status(200)
      .send(
        "Review added successfully: " +
          books[isbn].reviews[req.session.username]
      );
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.body;
  if (books[isbn] === undefined) {
    return res.status(404).send("Book not found");
  } else if (books[isbn].reviews[req.session.username] === undefined) {
    return res.status(404).send("Review not found");
  } else {
    delete books[isbn].reviews[req.session.username];
    return res.status(200).send("Review deleted");
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
