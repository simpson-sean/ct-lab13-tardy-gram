const pool = require('../utils/pool.js');
const Comment = require('../models/Comment.js');

module.exports = class Post {
  id;
  photoUrl;
  caption;
  tags;
  username;

  constructor(row) {
    this.id = row.id;
    this.photoUrl = row.photo_url;
    this.caption = row.caption;
    this.tags = row.tags;
    this.username = row.username;
  }

  static async insert({ photoUrl, caption, tags, username }) {
    const { rows } = await pool.query(
      'INSERT INTO posts (photo_url, caption, tags, username) VALUES($1, $2, $3, $4) RETURNING *',
      [photoUrl, caption, tags, username]
    );
    return new Post(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM posts');
    return rows.map((row) => new Post(row));
  }

  static async getPopular() {
    const { rows } = await pool.query(
      `SELECT posts.*, comments.*, COUNT(comments.post) AS number_of_comments
      FROM posts
      LEFT JOIN
      comments
      ON
      comments.post = posts.id
      GROUP BY
      posts.id, comments.id
      ORDER BY
      number_of_comments DESC
      LIMIT 10`);
    return rows.map(row => { return {
      post: new Post(row),
      comment: new Comment(row)
    };
    });
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `SELECT comments.post, posts.id, caption, photo_url, tags, username, comment_by, post, comment 
      FROM posts 
      LEFT JOIN
      comments 
      ON 
      comments.post = posts.id
      LEFT JOIN 
      users
      on
      users.github_username = comments.comment_by
      WHERE posts.id=$1
      `,
      [id]
    );

    return {
      post: new Post(rows[0]),
      comments: rows.map((row) => {
        const comment = new Comment(row);
        comment.commentBy = row.username;
        return comment;
      }),
    };
  }

  static async delete(reqUsername, id) {
    const username = await Post.getById(id);

    if(reqUsername === username.post.username) {
      await pool.query('DELETE FROM posts WHERE id=$1 RETURNING *', [id]);
      return { message: `Post ${id} was deleted.` };
    } else {
      return { message: `You're not authorized to delete post ${id}.` };
    }
  }

  static async update(reqUsername, caption, id) {
    const { post } = await Post.getById(id);
    
    if(reqUsername === post.username) {
      const { rows } = await pool.query(
        'UPDATE posts SET photo_url=$1, caption=$2, tags=$3 WHERE id=$4 RETURNING *',
        [post.photoUrl, caption, post.tags, id]
      );

      return new Post(rows[0]);
    } else {
      return { message: `You're not authorized to update post ${id}.` };
    }
  }
};
