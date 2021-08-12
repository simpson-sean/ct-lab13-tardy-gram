const { Router } = require('express');
const  Post  = require('../models/Post');
const ensureAuth = require('../middleware/ensure-auth'); 
module.exports = Router()
  .post('/', ensureAuth,   async (req, res, next) => {
    try {
      console.log(req.body);
      console.log(req.user.username);
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
