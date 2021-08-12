const { Router } = require('express');
const  Comment  = require('../models/Comment');
const ensureAuth = require('../middleware/ensure-auth'); 
module.exports = Router()
  .post('/', ensureAuth,   async (req, res, next) => {
    try {
      const response  = await Comment.insert({
        id: '1', 
        ...req.body,
        commentBy: req.user.username,
      });
      res.send(response);
    } catch(error) {
      next(error);
    } 
  })

  .delete('/:id', ensureAuth, async (req, res, next) => {
    try {
      const response = await Comment.delete(req.params.id)

      res.send({message: `${response.message} has been deleted` });
    
    } catch(err) {
      next(err);
    }
});
