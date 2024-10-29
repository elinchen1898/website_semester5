import { createApp } from "./config.js";

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

app.get("/login", async function (req, res) {
  res.render("login", {});
});

app.get("/register", async function (req, res) {
  res.render("register", {});
});

app.get("/account", async function (req, res) {
  const myposts = await app.locals.pool.query("select * from posts");
  const users = await app.locals.pool.query("select * from users");
  res.render("account", { users: users.rows, myposts: myposts.rows });
});

app.get("/blogdetail/:id", async function (req, res) {
  const myposts = await app.locals.pool.query(
    `select * from posts WHERE id = ${req.params.id}`
  );
  res.render("blogdetail", { myposts: myposts.rows });
});

app.get("/post", async function (req, res) {
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
  res.redirect("/");
});

app.get("/impressum", async function (req, res) {
  res.render("impressum", {});
});

/* Wichtig! Diese Zeilen müssen immer am Schluss der Website stehen! */
app.listen(3010, () => {
  console.log(`Example app listening at http://localhost:3010`);
});
