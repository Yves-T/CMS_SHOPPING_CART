const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator/check');
const Page = require('../models/page');

router.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

router.get('/add-page', (req, res) => {
  const title = '';
  const slug = '';
  const content = '';
  res.render('admin/add_page', { title, slug, content });
});

router.post(
  '/add-page',
  [
    body('title')
      .not()
      .isEmpty()
      .withMessage('title must have a value'),
    body('content')
      .not()
      .isEmpty()
      .withMessage('content must have a value'),
  ],
  (req, res) => {
    const title = req.body.title;
    let slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if (slug === '') {
      slug = title.replace(/\s+/g, '-').toLowerCase();
    }
    const content = req.body.content;

    const errors = validationResult(req);
    if (errors && errors.array() && errors.array().length > 0) {
      console.log('errors:', errors.array());
      return res.render('admin/add_page', {
        title,
        slug,
        content,
        errors: errors.array(),
      });
    } else {
      Page.findOne({ slug }, (err, page) => {
        if (page) {
          req.flash('danger', 'Page slug exists, choose another');
          return res.render('admin/add_page', {
            title,
            slug,
            content,
          });
        } else {
          const page = new Page({
            title,
            slug,
            content,
            sorting: 0,
          });
          page.save(err => {
            if (err) {
              console.log(err);
              return res.status(500).send({ err });
            }
            req.flash('success', 'page added');
            res.redirect('/admin/pages');
          });
        }
      });
    }
  },
);

module.exports = router;
