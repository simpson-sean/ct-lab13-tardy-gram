const pool = require('../utils/pool.js');

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

  static async getById(id) {
    console.log('===================================', id);
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
    console.log(rows[0]);
    return rows[0];
  }
};
