import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";

env.config();

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

db.connect();

const app = express();
const port = 3000;

const date = new Date();
const month = date.getMonth() + 1;
const day = date.getDate();
const year = date.getFullYear();
const lastDay = new Date(year, month, 0).getDate(); //last day of the current month

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("main.ejs", {
    month: month,
    day: day,
    year: year,
    lastDay: lastDay,
    selectedDate: null,
  });
});

app.get("/addEvent", (req, res) => {
  let selectedDate;

  if (req.query.date) {
    selectedDate = new Date(req.query.date);
  } else {
    selectedDate = new Date();
  }
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;
  const day = selectedDate.getDate();
  res.render("addEvent.ejs", { month: month, day: day, year:year });
});

app.post("/submitEvent", async (req, res) => {
  const title = req.body.title;
  const occasion = req.body.categoryType;
  const description = req.body.descriptionArea;
  const selectDate = req.body.selectedDate;
  try {
    await db.query(
      "INSERT INTO occasions (title, date, categoryType, description, created_at) VALUES ($1, $2, $3, $4, $5);",
      [title, selectDate, occasion, description, date]
    );
    res.redirect("/");
  } catch (err) {
    console.log("Error occured: ", err);
  }
});

app.listen(port, () => {
  console.log(`Server is running port ${port}`);
  console.log(month + 1);
});
