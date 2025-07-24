const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();

const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require('express-session');

const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

// server.js

const applicationsController = require('./controllers/applications.js'); 
// importing applications controller into server file

// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : "3000";
const authController = require("./controllers/auth.js");


mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(morgan('dev'));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passUserToView); // use new passUserToView middleware here 
// passes user info to an EJS template

app.get('/', (req, res) => { //home page
  // Check if the user is signed in 
  if (req.session.user) {
    // Redirect signed-in users to their applications index
    res.redirect(`/users/${req.session.user._id}/applications`)
  } else {
    //Show the homepage for users who are not signed in
    res.render('index.ejs');
  }
});

// server.js

app.use('/auth', authController);  // link controller to the specific route in server
//this tells the server that any incoming requests to /user/:userId/applications
//will be handled by applications controller
app.use(isSignedIn);
app.use('/users/:userId/applications', applicationsController); // New!

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});

