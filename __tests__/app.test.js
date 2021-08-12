const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');


jest.mock('../lib/middleware/ensure-auth.js', () => (req, res, next) => {
  req.user = {
    username: 'test_user',
    avatarUrl: 'http://example.com/image.png',
  };

  next();
});

describe('auth routes', () => {
  beforeEach(() => {
    return setup(pool).then(() =>
      User.insert({
        username: 'test_user',
        avatarUrl: 'http://example.com/image.png',
      })
    );
  });

  it('verify route displays the currently logged in user via GET', async () => {
    const res = await request(app).get('/api/v1/auth/verify');

    expect(res.body).toEqual({
      username: 'test_user',
      avatarUrl: 'http://example.com/image.png',
    });
  });
});
