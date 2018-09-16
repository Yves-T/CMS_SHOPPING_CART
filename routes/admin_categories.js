const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator/check');
const Category = require('../models/category');

router.get('/', (req, res) => {
  res.send('cats index');
});

module.exports = router;
