// controllers/applications.js

const express = require('express'); // importing express and creating router
const router = express.Router();

const User = require('../models/user.js'); // importing USER model to 
// access CRUD routes

router.get('/', (req, res) => {
 try {
    res.render('applications/index.ejs');
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// we will build out our router logic here

module.exports = router;  //exporting the router to use it in the 
// main server.js file
