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
const month = date.getMonth() + 1;
const day = date.getDate();
const year = date.getFullYear
const firstDay = new Date(year, month, 1);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", (req, res) =>{
    res.render("main.ejs", {month: month, day: day});
});

app.get("/addEvent", (req, res) => {
    res.render("addEvent.ejs", {month: month, day: day});
});

app.post("/submitEvent", async(req, res)=>{
    const title = req.body.title;
    const occasion = req.body.categoryType;
    const description = req.body.descriptionArea;
    try {
        await db.query("INSERT INTO occasions (title, categoryType, description, created_at) VALUES ($1, $2, $3, $4);", [title, occasion, description, date]);
        res.redirect("/");
    } catch (err) {
        console.log("Error occured: ", err);
    }
});

app.listen(port,()=>{
    console.log(`Server is running port ${port}`);
    console.log(month + 1);
});