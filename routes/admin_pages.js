const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator/check');

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
    if (errors) {
      console.log('errors:', errors.array());
      return res.render('admin/add_page', {
        title,
        slug,
        content,
        errors: errors.array(),
      });
    } else {
      console.log('success');
    }

    res.render('admin/add_page', { title, slug, content });
  },
);

module.exports = router;
