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

router.get('/add-category', (req, res) => {
  const title = '';
  res.render('admin/add_category', { title });
});

router.post(
  '/add-category',
  [
    body('title')
      .not()
      .isEmpty()
      .withMessage('title must have a value'),
  ],
  (req, res) => {
    const title = req.body.title;
    let slug = title.replace(/\s+/g, '-').toLowerCase();
    const content = req.body.content;

    const errors = validationResult(req);
    if (errors && errors.array() && errors.array().length > 0) {
      console.log('errors:', errors.array());
      return res.render('admin/add_category', {
        title,
        errors: errors.array(),
      });
    } else {
      Category.findOne({ slug }, (err, category) => {
        if (category) {
          req.flash('danger', 'Category title exists, choose another');
          return res.render('admin/add_category', { title });
        } else {
          const category = new Category({
            title,
            slug,
          });
          category.save(err => {
            if (err) {
              console.log(err);
              return res.status(500).send({ err });
            }
            req.flash('success', 'category added');
            res.redirect('/admin/categories');
          });
        }
      });
    }
  },
);

module.exports = router;
