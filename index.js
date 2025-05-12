import { createApp, upload } from "./config.js";
import bcrypt from "bcrypt";

const app = createApp({
  user: "restless_violet_3754",
  host: "bbz.cloud",
  database: "restless_violet_3754",
  password: "a0c3e114642e9d3cdc0c528ac026d55a",
  port: 30211,
});

/* start */
app.get("/", async function (req, res) {
  const posts = await app.locals.pool.query(
    "select * from posts ORDER BY id DESC"
  );
  const firstPost = posts.rows[0];
  res.render("start", {
    firstPost: firstPost,
    posts: posts.rows,
    currentPath: "home",
  });
});

app.post("/like/:id", async function (req, res) {
  if (!req.session.userid) {
    res.redirect("/login");
    return;
  }

  await app.locals.pool.query(
    "INSERT INTO likes (post_id, user_id) VALUES ($1, $2)",
    [req.params.id, req.session.userid]
  );

  res.send("ok");
});

app.get("/anfrage", async function (req, res) {
  if (!req.session.userid) {
    res.redirect("/login");
    return;
  }

  const userResult = await app.locals.pool.query(
    "SELECT username FROM users WHERE id = $1",
    [req.session.userid]
  );
  const user = userResult.rows[0];

  const postsResult = await app.locals.pool.query(
    "SELECT * FROM posts WHERE user_id = $1",
    [req.session.userid]
  );
  const myposts = postsResult.rows;

  const likesResult = await app.locals.pool.query(
    "SELECT posts.* FROM posts INNER JOIN likes ON posts.id = likes.post_id WHERE likes.user_id = $1",
    [req.session.userid]
  );
  const like = likesResult.rows;

  res.render("anfrage", { user, myposts, like });
});

app.get("/blogdetail/:id", async function (req, res) {
  const myposts = await app.locals.pool.query(
    "select * from posts WHERE id = $1",
    [req.params.id]
  );
  res.render("blogdetail", { myposts: myposts.rows });
});

app.get("/post", async function (req, res) {
  if (!req.session.userid) {
    res.redirect("/login");
    return;
  }
  res.render("post", {});
});

app.post("/create_post", upload.array("bild", 4), async function (req, res) {
  if (!req.session.userid) {
    res.redirect("/login");
    return;
  }

  await app.locals.pool.query(
    "INSERT INTO posts (titel, untertitel, inhalt, bild1, bild2, bild3, bild4, created_at, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, current_timestamp, $8)",
    [
      req.body.titel,
      req.body.untertitel,
      req.body.inhalt,
      req.files[0].filename,
      req.files[1].filename,
      req.files[2].filename,
      req.files[3].filename,
      req.session.userid,
    ]
  );

  res.redirect("/");
});

app.get("/404", async function (req, res) {
  res.render("404", {});
});

app.get("/404_reg", async function (req, res) {
  res.render("404_reg", {});
});

app.get("/impressum", async function (req, res) {
  res.render("impressum", {});
});

app.listen(3010, () => {
  console.log(`Example app listening at http://localhost:3010`);
});
