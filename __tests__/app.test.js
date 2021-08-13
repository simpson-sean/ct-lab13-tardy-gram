const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');
const Post = require('../lib/models/Post');
const Comment = require('../lib/models/Comment.js');

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

describe('Image Post Route', () => {
  beforeEach(() => {
    return setup(pool).then(() =>
      User.insert({
        username: 'test_user',
        avatarUrl: 'http://example.com/image.png',
      })
    );
  });

  it('Make a post to Tardy Gram', async () => {
    const post = {
      photoUrl: 'alchemycrrrrylab',
      caption: 'waaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaah',
      tags: ['tear', 'DJ', 'dJ'],
    };

    const res = await request(app).post('/api/v1/auth/post').send(post);

    expect(res.body).toEqual({
      id: '1',
      ...post,
      username: 'test_user',
    });
  });


  it('gets all tardygram posts', async () => {

    const post1 = await Post.insert({
      photoUrl: 'alchemycrrrrylab',
      caption: 'waaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaah',
      tags: ['tear', 'DJ', 'dJ'],
      username: 'test_user',
    });

    const post2 = await Post.insert({
      photoUrl: 'stairwelll',
      caption: 'tears are hydrating',
      tags: ['tear', '. kubisiak', 'kirby'],
      username: 'test_user',
    });

    const res = await request(app).get('/api/v1/post');
    // console.log('res', res);
    expect(res.body).toEqual([post1, post2]);
  });



  it('gets a tardygram post by id', async () => {
    const post = await Post.insert({
      photoUrl: 'alchemycrrrrylab',
      caption: 'waaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaah',
      tags: ['tear', 'DJ', 'dJ'],
      username: 'test_user',
    });

    await Comment.insert({
      comment: 'haha, nice one',
      post: 1,
      commentBy: 'test_user',
    });

    await Comment.insert({
      comment: 'super rad',
      post: 1,
      commentBy: 'test_user',
    });

    const res = await request(app).get(`/api/v1/post/${post.id}`);
    expect(res.body).toEqual({
      post: {
        id: '1',
        photoUrl: 'alchemycrrrrylab',
        caption: 'waaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaah',
        tags: ['tear', 'DJ', 'dJ'],
        username: 'test_user'
      },
      comments: [
        {
          id: '1',
          comment: 'haha, nice one',
          post: '1',
          commentBy: 'test_user'
        },
        {
          id: '1',
          comment: 'super rad',
          post: '1',
          commentBy: 'test_user'
        }
      ]
    });
  });
});

describe('comment routes', () => {
  beforeEach(() => {
    return setup(pool)
      .then(() =>
        User.insert({
          username: 'test_user',
          avatarUrl: 'http://example.com/image.png',
        })
      )
      .then(() =>
        Post.insert({
          photoUrl: 'xyz.com',
          caption: 'hotsummer',
          tags: ['Portland'],
          username: 'test_user',
        })
      );
  });

  it('Make a comment on a post', async () => {
    const comment = {
      comment: 'haha, nice one',
      post: '1',
    };

    const res = await request(app).post('/api/v1/auth/comments').send(comment);

    expect(res.body).toEqual({
      id: '1',
      ...comment,
      commentBy: 'test_user',
    });
  });

  it('deletes a comment', async () => {
    const comment = await Comment.insert({
      comment: 'haha, you got me',
      post: '1',
      commentBy: 'test_user',
    });

    const res = await request(app).delete(
      `/api/v1/auth/comments/${comment.id}`
    );

    expect(res.body).toEqual({
      message: `${res.body.comment} has been deleted`,
    });
  });
});
