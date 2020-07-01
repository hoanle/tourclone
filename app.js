const mongoose = require('mongoose')
require("dotenv").config({ path: ".env" });
const passport = require('passport');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const tagRoute = require('./src/routes/tagRoute');
const userRoute = require('./src/routes/userRoute');
const experienceRoute = require('./src/routes/experienceRoute');
const reviewRoute = require('./src/routes/reviewRoute');
const errorRoute = require('./src/routes/errorRoute');
const authRoute = require('./src/routes/authRoute')

const { errorHandler } = require('./src/controllers/errorController');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(tagRoute);
app.use(userRoute);
app.use(experienceRoute);
app.use(reviewRoute);
app.use(authRoute);
app.use(errorRoute);
app.use(errorHandler);

mongoose.connect(process.env.MONGODB_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})
  .then(() => console.log("connected to database"))

module.exports = app;
