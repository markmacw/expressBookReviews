const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (
    username === undefined ||
    password === undefined ||
    username === "" ||
    password === ""
  ) {
    return res.status(400).send("Username and Password must not be blank");
  } else if (!isValid(username)) {
    return res.status(400).send("Username already exists");
  } else {
    users.push({ username: username, password: password });
    return res.status(200).send("User registered successfully");
  }
});

// Simulated asynchronous function to fetch the book list
function fetchBookList() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(books); // Assuming 'books' is an array or object containing book details
    }, 1000); // Simulated delay of 1 second
  });
}

// Refactored route handler to use the asynchronous function
public_users.get("/", async (req, res) => {
  try {
    const bookList = await fetchBookList();
    return res.status(200).json(bookList); // Use .json() for automatic JSON.stringify and correct Content-Type
  } catch (error) {
    console.error("Error fetching book list:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// Simulated asynchronous function to fetch book details by ISBN
function fetchBookByIsbn(isbn) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(books[isbn]);
    }, 1000); // Simulated delay of 1 second
  });
}

// Refactored route handler to use the asynchronous function
public_users.get("/isbn/:isbn", async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const book = await fetchBookByIsbn(isbn);
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).send("Book not found.");
    }
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
});

// Simulated asynchronous function to fetch book by author
async function fetchBookByAuthor(author) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const book = Object.values(books).find((book) => book.author === author);
      resolve(book);
    }, 100); // Simulated delay
  });
}

// Refactored route handler to use the asynchronous function
public_users.get("/author/:author", async (req, res) => {
  const author = req.params.author;
  try {
    const book = await fetchBookByAuthor(author);
    if (book) {
      return res.status(200).json(book); // Use .json() for automatic JSON.stringify and correct Content-Type
    } else {
      return res.status(404).send("No book found by the given author.");
    }
  } catch (error) {
    console.error("Error fetching book:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// Simulated asynchronous function to fetch book by title
async function fetchBookByTitle(title) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const book = Object.values(books).find((book) => book.title === title);
      resolve(book);
    }, 100); // Simulated delay
  });
}

// Refactored route handler to use the asynchronous function
public_users.get("/title/:title", async (req, res) => {
  const title = req.params.title;
  try {
    const book = await fetchBookByTitle(title);
    if (book) {
      return res.status(200).json(book); // Use .json() for automatic JSON.stringify and correct Content-Type
    } else {
      return res.status(404).send("No book found with the given title.");
    }
  } catch (error) {
    console.error("Error fetching book:", error);
    return res.status(500).send("Internal Server Error");
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).send(JSON.stringify(books[isbn].reviews));
});

module.exports.general = public_users;
