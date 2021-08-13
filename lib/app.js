const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const authController = require('./controllers/auth');
const postController = require('./controllers/posts');
const commentController = require('./controllers/comments');

app.use(express.static(`${__dirname}/../public`));

app.use(express.json());
app.use(cookieParser());
app.use('/api/v1/auth', authController);
app.use('/api/v1/auth/post', postController);
app.use('/api/v1/post', postController);
app.use('/api/v1/auth/comments', commentController);

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
