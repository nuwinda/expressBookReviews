const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
    return users.some(user => user.username === username && user.password === password);
}

// Task 7: Login as registered user
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({message: "Invalid credentials"});
  }
  // Create JWT token
  let accessToken = jwt.sign({ username }, "access", { expiresIn: 60*60 });
  req.session.authorization = { accessToken, username };
  return res.status(200).json({message: "Login successful", token: accessToken});
});

// Task 8: Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization?.username;
  if (!username) {
    return res.status(401).json({message: "User not authenticated"});
  }
  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }
  if (!review) {
    return res.status(400).json({message: "Review is required"});
  }
  // Add or update review
  books[isbn].reviews[username] = review;
  return res.status(200).json({message: "Review added/updated", reviews: books[isbn].reviews});
});

// Task 9: Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;
  if (!username) {
    return res.status(401).json({message: "User not authenticated"});
  }
  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }
  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({message: "Review deleted", reviews: books[isbn].reviews});
  } else {
    return res.status(404).json({message: "Review not found for this user"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;