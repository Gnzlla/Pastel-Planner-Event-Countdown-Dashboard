import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "projects",
    password: "ekUbalu0902!",
    port: 5432
});

db.connect();

const app = express();
const port = 3000;

const date = new Date();
const month = date.getMonth();
const day = date.getDate();
const year = date.getFullYear
const firstDay = date(year, month, 1);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", (req, res) =>{
    res.render("main.ejs", {month: month, day: day});
});

app.get("/addEvent", (req, res) => {
    res.render("addEvent.ejs");
});

app.listen(port,()=>{
    console.log(`Server is running port ${port}`)
});