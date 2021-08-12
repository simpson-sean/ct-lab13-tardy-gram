const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  try {

    const { session } = req.cookies;
    const payload = jwt.verify(session, process.env.APP_SECRET);

    req.user = payload;
    next();
  } catch(error) {
    error.status = 401;
    error.message = 'Please log in to continue';
    next(error);
  }
};
