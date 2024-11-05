import { createApp } from "./config.js";
import bcrypt from "bcrypt";

const app = createApp({
  user: "restless_violet_3754",
  host: "bbz.cloud",
  database: "restless_violet_3754",
  password: "a0c3e114642e9d3cdc0c528ac026d55a",
  port: 30211,
});

/* Startseite */
app.get("/", async function (req, res) {
  const posts = await app.locals.pool.query("select * from posts");
  const firstPost = posts.rows[0];
  res.render("start", { firstPost: firstPost, posts: posts.rows });
});

app.get("/account", async function (req, res) {
  if (!req.session.userid) {
    res.redirect("/login");
    return;
  }

  // Fetch user information
  const userResult = await app.locals.pool.query(
    "SELECT username FROM users WHERE id = $1",
    [req.session.userid]
  );
  const user = userResult.rows[0];

  // Fetch posts made by the logged-in user
  const postsResult = await app.locals.pool.query(
    "SELECT * FROM posts WHERE user_id = $1",
    [req.session.userid]
  );
  const myposts = postsResult.rows;

  // Render the 'account' template with user and post data
  res.render("account", { user, myposts });
});

app.get("/blogdetail/:id", async function (req, res) {
  const myposts = await app.locals.pool.query(
    `select * from posts WHERE id = ${req.params.id}`
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

app.post("/create_post", async function (req, res) {
  await app.locals.pool.query(
    "INSERT INTO posts (titel, untertitel, inhalt, bild1, bild2, bild3, bild4, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, current_timestamp)",
    [
      req.body.titel,
      req.body.untertitel,
      req.body.inhalt,
      req.body.bild1,
      req.body.bild2,
      req.body.bild3,
      req.body.bild4,
    ]
  );
  if (!req.session.userid) {
    res.redirect("/login");
    return;
  }
  res.redirect("/");
});

app.get("/impressum", async function (req, res) {
  res.render("impressum", {});
});

/* Wichtig! Diese Zeilen müssen immer am Schluss der Website stehen! */
app.listen(3010, () => {
  console.log(`Example app listening at http://localhost:3010`);
});
