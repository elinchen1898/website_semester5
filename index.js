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

app.get("/impressum", async function (req, res) {
  res.render("impressum", {});
});

/* Wichtig! Diese Zeilen müssen immer am Schluss der Website stehen! */
app.listen(3010, () => {
  console.log(`Example app listening at http://localhost:3010`);
});
