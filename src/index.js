require("dotenv").config();

const path = require("path");
const express = require("express");
const app = express();
const database = require("./database");

const port = process.env.PORT || 3000;

const SUBJECT_COLLECTION = [
  "serre",
  "fraise",
  "radis",
  "salade",
  "chevaux",
  "poules",
];

app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/passage/:subject", (req, res) => {
  const subject = req.params.subject;

  if (!SUBJECT_COLLECTION.includes(subject)) {
    res
      .status(400)
      .render("error", { message: "Type de passage non supporté" });
    return;
  }

  database
    .addPassage(subject)
    .then(() => res.render("success", { subject }))
    .catch((err) => res.status(500).render("error", { message: err }));
});

app.get("/statistiques", (req, res) => {
  const statCollection = [];
  Promise.all(
    SUBJECT_COLLECTION.map((subject) =>
      database.getAllPassage(subject).then((data) => {
        statCollection.push({
          subject,
          passages: data.length,
        });
      })
    )
  ).then(() => {
    res.render("statistics", { statCollection });
  });
});

app.listen(port, () => {
  database
    .connection(process.env.MONGODB_CONNECTION_STRING)
    .then(() => console.log("Connected to database"))
    .then(() => console.log(`App running at port ${port}`));
});
