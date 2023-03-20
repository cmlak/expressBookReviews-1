const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}


//write code to check if username and password match the one we have in records.
const authenticatedUser = (username,password)=>{
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}


//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});


regd_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
  });
  
// Get the book list available in the shop
regd_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));
  
});

// Add a book review
regd_users.put("/auth/reviews/:isbn", (req, res) => {
    
        const isbn = req.params.isbn;
        let book = books[isbn]
        if (book) { //Check is book exists
            let reviews = req.body.reviews;
            
            //if review has been changed, update the review
            if(reviews) {
                book["reviews"] = reviews
            }
            res.send(books[isbn]);
        }
        else{
            res.send("Unable to find the book!");
        }
});

// Delete a book review
regd_users.delete("/auth/reviews/:isbn", (req, res) => {
    const isbn = req.params.isbn;
        if (isbn){
            books[isbn]['reviews']={}
        }
        res.send(books[isbn]);
      });
    
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

