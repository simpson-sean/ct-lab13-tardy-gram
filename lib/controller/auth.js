
const { Router } = require('express')





module.exports = Router()
    .get('/login', (req, res) => {
        res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=read:user`);
    })
    