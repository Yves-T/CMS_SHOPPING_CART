const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator/check');
const Category = require('../models/category');

router.get('/', (req, res) => {
  Category.find((err, categories) => {
    if (err) {
      return console.log(err);
    }
    res.render('admin/categories', {
      categories,
    });
  });
});

module.exports = router;
