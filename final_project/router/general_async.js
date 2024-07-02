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

// Get book details based on author
public_users.get("/author/:author", async (req, res) => {
  const author = req.params.author;
  for (const bookId of Object.keys(books)) {
    const book = await fetchBookById(bookId);
    if (book.author === author) {
      return res.status(200).json(book);
    }
  }
  res.status(404).send("No book found by the given author.");
});

// Assuming an async function to fetch book by ID (simulated for demonstration)
async function fetchBookById(bookId) {
  // Simulate fetching book data asynchronously, e.g., from a database
  await new Promise((resolve) => setTimeout(resolve, 100)); // Simulated delay
  return books[bookId]; // Assuming 'books' is accessible in this scope
}

public_users.get("/title/:title", async (req, res) => {
  const title = req.params.title;
  for (const bookId of Object.keys(books)) {
    const book = await fetchBookById(bookId); // Fetch book data asynchronously
    if (book.title === title) {
      return res.status(200).json(book); // Directly send JSON without manual stringification
    }
  }
  res.status(404).send("No book found with the given title."); // Send 404 if no book matches
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).send(JSON.stringify(books[isbn].reviews));
});

module.exports.general = public_users;
