const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }
  
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
  });
  


// Get the book list available in the shop
public_users.get('/',async function (req, res) {
    res.send(JSON.stringify(books,null,4));
  
});

// Get book details based on ISBN
public_users.get('/:isbn',async function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn])
});

  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
    const author = req.params.author;
    let bookAuthor = Object.keys(books)
    .filter((key) => books[key].author === author)
    .reduce((obj, key) => {
        return Object.assign(obj, 
          books[key]
        );
  }, {});
    res.send(bookAuthor);
});


// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    const title = req.params.title;
    let bookTitle = Object.keys(books)
    .filter((key) => books[key].title === title)
    .reduce((obj, key) => {
        return Object.assign(obj, 
          books[key]
        );
  }, {});
    res.send(bookTitle);
});


//  Get book review
public_users.get('/review/:isbn',async function (req, res) {
const isbn = req.params.isbn;
    let bookReview = Object.keys(books)
    .filter((key) => books[key].isbn === isbn)
    .reduce((obj, key) => {
        return Object.assign(obj, 
          books[key]
        );
  }, {});
    res.send(bookReview);
});

module.exports.general = public_users;








