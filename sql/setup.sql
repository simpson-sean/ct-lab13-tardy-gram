DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS posts;
CREATE TABLE users (
  github_username TEXT NOT NULL PRIMARY KEY,
  github_avatar_url TEXT NOT NULL
);
CREATE TABLE posts (
  id BIGINT NOT NULL PRIMARY KEY,
  photo_url TEXT NOT NULL,
  caption TEXT,
  tags TEXT [],
  username TEXT REFERENCES users(github_username)
);