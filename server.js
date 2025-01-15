const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();
const port = 1234;

const cors = require("cors");
app.set("view engine", "ejs");

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Read
app.get("/", async (req, res) => {
  try {
    // fetch todos from server
    const { rows } = await db.query(`SELECT * from todo`);
    // Render the index.ejs file and pass todos as data
    res.render("index", { todos: rows });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Create
app.post("/add", async (req, res) => {
  const { todoText } = req.body;
  try {
    if (!todoText) {
      return res.status(400).send("Text for todo list is required");
    }
    // grab text from input field
    await db.query(`INSERT INTO todo (task) VALUES ($1)`, [todoText]);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Delete
app.post("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(`DELETE FROM todo WHERE id = $1`, [id]);
    res.redirect("/");
  } catch (err) {
    res.status(500).send("Server error");
  }
});

app.listen(port, () => {
  console.log(`Server listening at port: ${port}`);
});
