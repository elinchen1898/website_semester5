import express from "express";
import { engine } from "express-handlebars";
import pg from "pg";
const { Pool } = pg;
import cookieParser from "cookie-parser";
import multer from "multer";
const upload = multer({ dest: "public/uploads/" });
import sessions from "express-session";
import bcrypt from "bcrypt";

export function createApp(dbconfig) {
  const app = express();

  const pool = new Pool(dbconfig);

  app.engine("handlebars", engine());
  app.set("view engine", "handlebars");
  app.set("views", "./views");

  app.use(express.static("public"));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(
    sessions({
      secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
      saveUninitialized: true,
      cookie: { maxAge: 86400000, secure: false },
      resave: false,
    })
  );

  app.locals.pool = pool;

  app.get("/login", (req, res) => {
    res.render("login");
  });

  app.post("/login", async function (req, res) {
    const result = await app.locals.pool.query(
      "SELECT * FROM users WHERE username = $1",
      [req.body.username]
    );

    if (
      result.rows.length > 0 &&
      bcrypt.compareSync(req.body.passwort, result.rows[0].passwort)
    ) {
      req.session.userid = result.rows[0].id;
      res.redirect("/account");
    } else {
      res.redirect("/404");
    }
  });

  app.get("/register", async function (req, res) {
    res.render("register", {});
  });

  app.post("/register", async function (req, res) {
    // Check if username already exists
    const result = await app.locals.pool.query(
      "SELECT username FROM users WHERE username = $1",
      [req.body.username]
    );

    if (result.rows.length > 0) {
      return res.status(401).send("Username already exists");
    }

    // Insert new user
    await app.locals.pool.query(
      "INSERT INTO users (username, email, passwort) VALUES ($1, $2, $3)",
      [
        req.body.username,
        req.body.email,
        bcrypt.hashSync(req.body.passwort, 10),
      ]
    );
    res.redirect("/login");
  });

  return app;
}

export { upload };
