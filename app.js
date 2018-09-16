const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const { database } = require('./config/database');
const pages = require('./routes/pages');
const adminPages = require('./routes/admin_pages');
const adminCategories = require('./routes/admin_categories');

mongoose.connect(
  database,
  { useNewUrlParser: true },
);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  // we're connected!
});

const app = express();

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.set('trust proxy', 1); // trust first proxy
app.use(
  session({ resave: true, saveUninitialized: true, secret: 'someSecret' }),
);
app.use(flash());
app.use(function(req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// set public folder
app.use(express.static(path.join(__dirname, 'public')));
app.locals.errors = null;

// set routes
app.use('/admin/pages', adminPages);
app.use('/admin/categories', adminCategories);
app.use('/', pages);

const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
