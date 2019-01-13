#!/usr/bin node
"use strict";

// Include important and required node modules and initialize express
const express    = require("express"),
      app        = express(),
      path       = require("path"),
      cors       = require("cors"),
      bodyParser = require("body-parser"),
      mongoose   = require("mongoose"),
      morgan     = require("morgan"),
      ErrorCodes = require("./api/api.errorCodes");

// Include config files and user modules
const config     = require("./config/config"),
      router     = require("./api/api.router");

// Set basic middleware function for all Express requests
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cors());

// Set static file directory
app.use(express.static(path.join(__dirname, "..", "frontend", "dist", "project-domian")))

// Use API router
router(app);

// connect to mongoose
const mongooseOptions = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true
};

mongoose.Promise = global.Promise;
mongoose.connect(config.database, mongooseOptions).then(
  () => {
    console.log("Connection to MongoDB established")

    // Start express and listen on either process.env.PORT (if set) or on
    // default port 3030
    let server = app.listen(config.port, () => {
      const port = server.address().port;
      console.log("The server is now listening on port", port);
    });
  },
  err => { console.log("could not connect to the database " + err)}
);
