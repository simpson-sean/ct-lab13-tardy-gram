const pool = require('../utils/pool.js');


module.exports = class Comment {
    id;
    comment;
    post;
    commentBy;
  
    constructor(row) {
      this.id = row.id; 
      this.comment = row.comment; 
      this.post = row.post; 
      this.commentBy = row.comment_by;
    }

    static async insert({ comment, post, commentBy }) {
      const { rows } = await pool.query(
        'INSERT INTO comments (comment, post, comment_by) VALUES ($1, $2, $3) RETURNING *',
        [comment, post, commentBy]
      );
      return new Comment(rows[0]); 
    }

    static async delete(id) {
      const { rows } = await pool.query(
        'DELETE FROM comments WHERE id=$1 RETURNING *', 
        [id]
      );
      return new Comment(rows[0]);
    }


};
