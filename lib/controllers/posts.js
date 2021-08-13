const { Router } = require('express');
const Post = require('../models/Post');
const ensureAuth = require('../middleware/ensure-auth');

module.exports = Router()
  .post('/', ensureAuth, async (req, res, next) => {
    try {
      const response = await Post.insert({
        ...req.body,
        username: req.user.username,
      });
      res.send(response);
    } catch(error) {
      next(error);
    }
  })

  .get('/', async (req, res, next) => {
    console.log('we\'re hitting this get route!');
    try {
      const response = await Post.getAll();
      console.log(response);
      res.send(response);
    } catch(error) {
      console.log('error!');
      next(error);
    }
  })

  .get('/:id', async (req, res, next) => {
    try {
      const response = await Post.getById(req.params.id);
      res.send(response);
    } catch(error) {
      next(error);
    }
  });
