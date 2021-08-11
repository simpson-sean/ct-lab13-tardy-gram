
const { Router } = require('express');
const { exchangeCodeForToken, getUserProfile } = require('../utils/githubHelper.js');



module.exports = Router()
  .get('/login', (req, res) => {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=read:user`);
  })
  .get('/login/callback', async (req, res, next) => {
    const TOKEN = await exchangeCodeForToken(req.query.code);
    const profile = await getUserProfile(TOKEN);
      console.log(TOKEN);
    console.log(`THis is the user profile ${profile}`);
        
    res.send(`Authorized by Github!! ${req.query.code}`);
  });
