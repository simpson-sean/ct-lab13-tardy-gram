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
    try {
      const response = await Post.getAll();
      res.send(response);
    } catch(error) {
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
  })
  
  .delete('/:id', ensureAuth, async (req, res, next) => {
    try {
      const response = await Post.delete(req.user.username, req.params.id);

      res.send(response);
      
    } catch(error) {
      next(error);
    }
  });
