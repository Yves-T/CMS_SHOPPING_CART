const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator/check');
const Page = require('../models/page');

router.get('/', (req, res) => {
  Page.find({})
    .sort({ sorting: 1 })
    .exec((err, pages) => {
      res.render('admin/pages', {
        pages,
      });
    });
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
            sorting: 100,
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

router.post('/reorder-pages', (req, res) => {
  // consol;
  const ids = req.body['id[]'];
  let count = 0;

  for (var i = 0; i < ids.length; i++) {
    const id = ids[i];
    count++;
    (function(count) {
      Page.findById(id, (err, page) => {
        page.sorting = count;
        page.save(err => {
          if (err) {
          }
        });
      });
    })(count);
  }
});

router.get('/edit-page/:slug', (req, res) => {
  Page.findOne({ slug: req.params.slug }, (err, page) => {
    if (err) {
      return console.log(err);
    }
    const { title, slug, content, _id } = page;
    res.render('admin/edit_page', { title, slug, content, id: _id });
  });
});

router.post(
  '/edit-page/:slug',
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

    const { content, id } = req.body;

    const errors = validationResult(req);
    if (errors && errors.array() && errors.array().length > 0) {
      console.log('errors:', errors.array());
      return res.render('admin/edit_page', {
        title,
        slug,
        content,
        id,
        errors: errors.array(),
      });
    } else {
      Page.findOne({ slug, _id: { $ne: id } }, (err, page) => {
        if (page) {
          req.flash('danger', 'Page slug exists, choose another');
          return res.render('admin/add_page', {
            title,
            slug,
            content,
            id,
          });
        } else {
          Page.findById(id, (err, page) => {
            if (err) {
              return console.log(err);
            }
            page.title = title;
            page.slug = slug;
            page.content = content;

            page.save(err => {
              if (err) {
                console.log(err);
                return res.status(500).send({ err });
              }
              req.flash('success', 'page added');
              res.redirect(`/admin/pages/edit-page/${page.slug}`);
            });
          });
        }
      });
    }
  },
);

router.get('/delete-page/:id', (req, res) => {
  Page.findByIdAndRemove(req.params.id, (err, pages) => {
    if (err) {
      return console.log(err);
    }
    req.flash('success', 'page deleted');
    res.redirect(`/admin/pages`);
  });
});

module.exports = router;
