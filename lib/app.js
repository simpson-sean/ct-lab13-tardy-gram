const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const authController = require('./controllers/auth');
const postController = require('./controllers/post'); 

app.use(express.static(`${__dirname}/../public`));

app.use(express.json());
app.use(cookieParser());
app.use('/api/v1/auth', authController);
app.use('/api/v1/auth/post', postController);

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
