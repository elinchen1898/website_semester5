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
  res.render("start", {});
});

app.get("/login", async function (req, res) {
  res.render("login", {});
});

app.get("/register", async function (req, res) {
  res.render("register", {});
});

app.get("/account", async function (req, res) {
  const myposts = await app.locals.pool.query("select * from posts");
  res.render("account", { myposts: myposts.rows });
});

app.get("/blogdetail", async function (req, res) {
  res.render("blogdetail", {});
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
