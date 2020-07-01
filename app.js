const mongoose = require('mongoose')
require("dotenv").config({ path: ".env" });
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var router = express.Router();

const tagRoute = require('./src/routes/tagRoute');
const userRoute = require('./src/routes/userRoute');
const experienceRoute = require('./src/routes/experienceRoute');
const reviewRoute = require('./src/routes/reviewRoute');
const errorRoute = require('./src/routes/errorRoute');

const { errorHandler, notFound } = require('./src/controllers/errorController');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(tagRoute);
app.use(userRoute);
app.use(experienceRoute);
app.use(reviewRoute);
app.use(errorRoute);
app.use(errorHandler);

app.listen(process.env.SERVER_PORT, () => console.log(`Example app listening at http://localhost:${process.env.SERVER_PORT}`));
mongoose.connect(process.env.MONGODB_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})
  .then(() => console.log("connected to database"))

module.exports = app;
