const User = require('../models/User.js');
const {
  exchangeCodeForToken,
  getUserProfile,
} = require('../utils/githubHelper.js');

module.exports = class UserService {
  static async create(code) {
    const TOKEN = await exchangeCodeForToken(code);
    const profile = await getUserProfile(TOKEN);
    const user = await User.findByUsername(profile.login);

    if(!user) {
      return User.insert({
        username: profile.login,
        avatarUrl: profile.avatar_url,
      });
    } else {
      return user;
    }
  }
};
