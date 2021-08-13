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
        username: 'test_user',
      },
      comments: [
        {
          id: '1',
          comment: 'haha, nice one',
          post: '1',
          commentBy: 'test_user',
        },
        {
          id: '1',
          comment: 'super rad',
          post: '1',
          commentBy: 'test_user',
        },
      ],
    });
  });

  it('deletes a post by its id', async () => {
    const post = await Post.insert({
      photoUrl: 'alchemycrrrrylab',
      caption: 'waaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaah',
      tags: ['tear', 'DJ', 'dJ'],
      username: 'test_user',
    });

    const res = await request(app).delete(`/api/v1/auth/post/${post.id}`);
    expect(res.body).toEqual({ message: `Post ${post.id} was deleted.` });
  });

  it('does not delete a post if the logged user does not match', async () => {
    await User.insert({
      username: 'best_user',
      avatarUrl: 'http://example.com/image.png',
    });

    const post = await Post.insert({
      photoUrl: 'alchemycrrrrylab',
      caption: 'waaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaah',
      tags: ['tear', 'DJ', 'dJ'],
      username: 'best_user',
    });

    const res = await request(app).delete(`/api/v1/auth/post/${post.id}`);
    expect(res.body).toEqual({
      message: `You're not authorized to delete post ${post.id}.`,
    });
  });

  it('Patch: update a post partially', async () => {
    const post = await Post.insert({
      photoUrl: 'alchemycrrrrylab',
      caption: 'waaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaah',
      tags: ['tear', 'DJ', 'dJ'],
      username: 'test_user',
    });

    const res = await request(app)
      .patch(`/api/v1/auth/post/${post.id}`)
      .send({ caption: 'xyz' });

    expect(res.body).toEqual({
      ...post,
      caption: 'xyz',
    });
  });

  it('gets top ten tardygram posts', async () => {
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

    const post3 = await Post.insert({
      photoUrl: 'stairwelll',
      caption: 'tears are hydrating',
      tags: ['tear', '. kubisiak', 'kirby'],
      username: 'test_user',
    });

    const post4 = await Post.insert({
      photoUrl: 'stairwelll',
      caption: 'tears are hydrating',
      tags: ['tear', '. kubisiak', 'kirby'],
      username: 'test_user',
    });

    const post5 = await Post.insert({
      photoUrl: 'stairwelll',
      caption: 'tears are hydrating',
      tags: ['tear', '. kubisiak', 'kirby'],
      username: 'test_user',
    });

    const post6 = await Post.insert({
      photoUrl: 'stairwelll',
      caption: 'tears are hydrating',
      tags: ['tear', '. kubisiak', 'kirby'],
      username: 'test_user',
    });

    const post7 = await Post.insert({
      photoUrl: 'stairwelll',
      caption: 'tears are hydrating',
      tags: ['tear', '. kubisiak', 'kirby'],
      username: 'test_user',
    });

    const post8 = await Post.insert({
      photoUrl: 'stairwelll',
      caption: 'tears are hydrating',
      tags: ['tear', '. kubisiak', 'kirby'],
      username: 'test_user',
    });

    const post9 = await Post.insert({
      photoUrl: 'stairwelll',
      caption: 'tears are hydrating',
      tags: ['tear', '. kubisiak', 'kirby'],
      username: 'test_user',
    });

    const post10 = await Post.insert({
      photoUrl: 'stairwelll',
      caption: 'tears are hydrating',
      tags: ['tear', '. kubisiak', 'kirby'],
      username: 'test_user',
    });

    await Post.insert({
      photoUrl: 'stairwelll',
      caption: 'tears are hydrating',
      tags: ['tear', '. kubisiak', 'kirby'],
      username: 'test_user',
    });

    await Comment.insert({
      comment: 'haha, nice one',
      post: post1.id,
      commentBy: 'test_user',
    });
    
    await Comment.insert({
      comment: 'haha, nice one',
      post: post2.id,
      commentBy: 'test_user',
    });
    await Comment.insert({
      comment: 'haha, nice one',
      post: post3.id,
      commentBy: 'test_user',
    });
    await Comment.insert({
      comment: 'haha, nice one',
      post: post4.id,
      commentBy: 'test_user',
    });
    await Comment.insert({
      comment: 'haha, nice one',
      post: post5.id,
      commentBy: 'test_user',
    });
    await Comment.insert({
      comment: 'haha, nice one',
      post: post6.id,
      commentBy: 'test_user',
    });
    await Comment.insert({
      comment: 'haha, nice one',
      post: post7.id,
      commentBy: 'test_user',
    });
    await Comment.insert({
      comment: 'haha, nice one',
      post: post8.id,
      commentBy: 'test_user',
    });
    await Comment.insert({
      comment: 'haha, nice one',
      post: post9.id,
      commentBy: 'test_user',
    });
    await Comment.insert({
      comment: 'haha, nice one',
      post: post10.id,
      commentBy: 'test_user',
    });

    const res = await request(app).get('/api/v1/post/popular');

    expect(res.body).toEqual([
      {
        comment: {
          comment: 'haha, nice one',
          commentBy: 'test_user',
          id: '10',
          post: '10',
        },
        post: {
          caption: 'tears are hydrating',
          id: '10',
          photoUrl: 'stairwelll',
          tags: ['tear', '. kubisiak', 'kirby'],
          username: 'test_user',
        },
      },
      {
        comment: {
          comment: 'haha, nice one',
          commentBy: 'test_user',
          id: '1',
          post: '1',
        },
        post: {
          caption: 'waaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaah',
          id: '1',
          photoUrl: 'alchemycrrrrylab',
          tags: ['tear', 'DJ', 'dJ'],
          username: 'test_user',
        },
      },
      {
        comment: {
          comment: 'haha, nice one',
          commentBy: 'test_user',
          id: '7',
          post: '7',
        },
        post: {
          caption: 'tears are hydrating',
          id: '7',
          photoUrl: 'stairwelll',
          tags: ['tear', '. kubisiak', 'kirby'],
          username: 'test_user',
        },
      },
      {
        comment: {
          comment: 'haha, nice one',
          commentBy: 'test_user',
          id: '6',
          post: '6',
        },
        post: {
          caption: 'tears are hydrating',
          id: '6',
          photoUrl: 'stairwelll',
          tags: ['tear', '. kubisiak', 'kirby'],
          username: 'test_user',
        },
      },
      {
        comment: {
          comment: 'haha, nice one',
          commentBy: 'test_user',
          id: '9',
          post: '9',
        },
        post: {
          caption: 'tears are hydrating',
          id: '9',
          photoUrl: 'stairwelll',
          tags: ['tear', '. kubisiak', 'kirby'],
          username: 'test_user',
        },
      },
      {
        comment: {
          comment: 'haha, nice one',
          commentBy: 'test_user',
          id: '2',
          post: '2',
        },
        post: {
          caption: 'tears are hydrating',
          id: '2',
          photoUrl: 'stairwelll',
          tags: ['tear', '. kubisiak', 'kirby'],
          username: 'test_user',
        },
      },
      {
        comment: {
          comment: 'haha, nice one',
          commentBy: 'test_user',
          id: '3',
          post: '3',
        },
        post: {
          caption: 'tears are hydrating',
          id: '3',
          photoUrl: 'stairwelll',
          tags: ['tear', '. kubisiak', 'kirby'],
          username: 'test_user',
        },
      },
      {
        comment: {
          comment: 'haha, nice one',
          commentBy: 'test_user',
          id: '8',
          post: '8',
        },
        post: {
          caption: 'tears are hydrating',
          id: '8',
          photoUrl: 'stairwelll',
          tags: ['tear', '. kubisiak', 'kirby'],
          username: 'test_user',
        },
      },
      {
        comment: {
          comment: 'haha, nice one',
          commentBy: 'test_user',
          id: '5',
          post: '5',
        },
        post: {
          caption: 'tears are hydrating',
          id: '5',
          photoUrl: 'stairwelll',
          tags: ['tear', '. kubisiak', 'kirby'],
          username: 'test_user',
        },
      },
      {
        comment: {
          comment: 'haha, nice one',
          commentBy: 'test_user',
          id: '4',
          post: '4',
        },
        post: {
          caption: 'tears are hydrating',
          id: '4',
          photoUrl: 'stairwelll',
          tags: ['tear', '. kubisiak', 'kirby'],
          username: 'test_user',
        },
      },
    ]);
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
