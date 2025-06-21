const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  // Task 6: Register a new user
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  if (isValid(username)) {
    return res.status(409).json({message: "Username already exists"});
  }
  users.push({ username, password });
  return res.status(200).json({message: "User registered successfully"});
});

// Task 1: Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.status(200).json(books[isbn]);
  } else {
    res.status(404).json({ message: "Book not found"});
  }
});

// Task 3: Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const results = [];
  for (let key in books) {
    if (books[key].author === author) {
      results.push(books[key]);
    }
  }
  if (results.length) {
    res.status(200).json(results);
  } else {
    res.status(404).json({ message: "No books found by this author"});
  }
});

// Task 4: Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const results = [];
  for (let key in books) {
    if (books[key].title === title) {
      results.push(books[key]);
    }
  }
  if (results.length) {
    res.status(200).json(results);
  } else {
    res.status(404).json({ message: "No books found with this title"});
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.status(200).json(books[isbn].reviews);
  } else {
    res.status(404).json({ message: "Book not found"});
  }
});
// Task 10: Get the book list using async/await (Promise)
public_users.get('/async/books', async (req, res) => {
  try {
    const getBooks = () => {
      return new Promise((resolve) => {
        resolve(books);
      });
    };
    const allBooks = await getBooks();
    res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (err) {
    res.status(500).json({ message: "Error retrieving books" });
  }
});

// Task 11: Get book details by ISBN using async/await (Promise)
public_users.get('/async/isbn/:isbn', async (req, res) => {
  try {
    const getBookByISBN = (isbn) => {
      return new Promise((resolve, reject) => {
        if (books[isbn]) resolve(books[isbn]);
        else reject("Book not found");
      });
    };
    const book = await getBookByISBN(req.params.isbn);
    res.status(200).json(book);
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

// Task 12: Get book details by author using async/await (Promise)
public_users.get('/async/author/:author', async (req, res) => {
  try {
    const getBooksByAuthor = (author) => {
      return new Promise((resolve, reject) => {
        const results = [];
        for (let key in books) {
          if (books[key].author === author) results.push(books[key]);
        }
        if (results.length) resolve(results);
        else reject("No books found by this author");
      });
    };
    const booksByAuthor = await getBooksByAuthor(req.params.author);
    res.status(200).json(booksByAuthor);
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

// Task 13: Get book details by title using async/await (Promise)
public_users.get('/async/title/:title', async (req, res) => {
  try {
    const getBooksByTitle = (title) => {
      return new Promise((resolve, reject) => {
        const results = [];
        for (let key in books) {
          if (books[key].title === title) results.push(books[key]);
        }
        if (results.length) resolve(results);
        else reject("No books found with this title");
      });
    };
    const booksByTitle = await getBooksByTitle(req.params.title);
    res.status(200).json(booksByTitle);
  } catch (err) {
    res.status(404).json({ message: err });
  }
});
module.exports.general = public_users;