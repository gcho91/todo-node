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

// Serve static files from the "public" folder

app.use(express.static("public"));

// API Endpoint: Fetch all todos
app.get("/api/todos", async (req, res) => {
  try {
    const { rows } = await db.query(`SELECT * from todo`);
    res.status(200).json(rows); // Send JSON data
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// API Endpoint - Add a new todo
app.post("/api/add", async (req, res) => {
  const { todoText } = req.body;
  try {
    if (!todoText) {
      return res.status(400).send("Text for todo list is required");
    }
    // grab text from input field
    await db.query(`INSERT INTO todo (task) VALUES ($1)`, [todoText]);
    // Send success response
    res.status(200).json({ message: "Todo added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// API Endpoint - Delete a todo by ID
app.post("/api/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(`DELETE FROM todo WHERE id = $1`, [id]);
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (err) {
    console.error(err);

    res.status(500).send("Server error");
  }
});

app.listen(port, () => {
  console.log(`Server listening at port: ${port}`);
});
