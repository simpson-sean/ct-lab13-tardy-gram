const express = require('express');
const app = express();
const authController = require('./controller/auth')


app.use(express.static(`${__dirname}/../public`));

app.use(express.json());
app.use('/api/v1/auth', authController)

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
