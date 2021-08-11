const { Router } = require('express');
const User = require('../models/User.js');
const {
  exchangeCodeForToken,
  getUserProfile,
} = require('../utils/githubHelper.js');

module.exports = Router()
  .get('/login', (req, res) => {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=read:user`
    );
  })
  .get('/login/callback', async (req, res, next) => {
    const TOKEN = await exchangeCodeForToken(req.query.code);
    const profile = await getUserProfile(TOKEN);
    let user = await User.findByUsername(profile.login);

    if(!user) {
      user = User.insert({
        username: profile.login,
        avatarUrl: profile.avatar_url,
      });
    } else res.send(`Authorized by Github!! ${user.username}`);
  });
