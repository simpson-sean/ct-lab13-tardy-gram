const { Router } = require('express');
const  Post  = require('../models/Post');
const ensureAuth = require('../middleware/ensure-auth'); 
module.exports = Router()
  .post('/', ensureAuth,   async (req, res, next) => {
    try {
      const response  = await Post.insert({
        id: '1', 
        ...req.body,
        username: req.user.username,
      });
      res.send(response);
    } catch(error) {
      next(error);
    } 
  });
