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
  app.engine(
    "handlebars",
    engine({
      helpers: {
        eq: function (a, b) {
          return a === b;
        },
      },
    })
  );
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

  /*Login*/
  app.get("/login", (req, res) => {
    res.render("login");
  });
  app.get("/verein", (req, res) => {
    res.render("verein", { currentPath: "verein" });
  });

  app.get("/Rangliste", (req, res) => {
    res.render("Rangliste");
  });

  app.get("/intern", (req, res) => {
    res.render("intern");
  });

  app.get("/mehrinfo", (req, res) => {
    res.render("mehrinfo");
  });

  app.get("/K1", (req, res) => {
    res.render("K1");
  });

  app.get("/K4", (req, res) => {
    res.render("K4");
  });

  app.get("/Kbasis", (req, res) => {
    res.render("Kbasis");
  });
  app.get("/training", (req, res) => {
    res.render("training", { currentPath: "training" });
  });

  app.get("/Erklaerungsseite", (req, res) => {
    res.render("Erklaerungsseite");
  });

  app.get("/kontakt", (req, res) => {
    res.render("kontakt");
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
      res.redirect("/anfrage");
    } else {
      res.redirect("/404");
    }
  });

  /*anfrage*/
  app.get("/anfrage", async function (req, res) {
    res.render("anfrage", {});
  });

  app.post("/anfrage", async function (req, res) {
    // Check if username already exists
    const result = await app.locals.pool.query(
      "SELECT username FROM users WHERE username = $1",
      [req.body.username]
    );

    if (result.rows.length > 0) {
      return res.redirect("/404_reg");
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
