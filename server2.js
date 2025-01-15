const express = require("express");
const bodyParser = require("body-parser");

const pool = require("./db");
const app = express();
const cors = require("cors");
const port = 1234;

app.set("view engine", "ejs");

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", function (req, res) {
  // res.json({ info: "Node.js, Express, and Postgres API" });
  // res.render("index", { title: "Mini Message Board", messages: messages });
  res.render("index");
});

const getAll = (request, response) => {
  pool.query("SELECT * FROM todo", (error, results) => {
    if (error) {
      return response.status(500).json({ error: error.message });
    }
    response.status(200).json(results.rows);
  });
};

const createTable = (request, response) => {
  const query = `CREATE TABLE IF NOT EXISTS todo2(
    id serial PRIMARY KEY,
    column1 text,
    column2 text
  )`;
  pool.query(query, (error, results) => {
    if (error) {
      console.error("Error creating table:", error);
      return response.status(500).json({ error: error.message });
    } else {
      console.log("Table created successfully");
      response.status(200).json({ message: "Table created successfully" });
    }
  });
};

const addTask = async (req, res) => {
  const { task } = req.body; // the body's format: {"task": "new task text here"}
  try {
    const newTaskQuery = `INSERT INTO todo(task) VALUES ($1) RETURNING *`;
    const result = await pool.query(newTaskQuery, [task]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding new task:", error);
    res.status(500).json({ error: "Error adding new task" });
  }
};

const deleteTask = async (req, res) => {
  // delete task by id
  const { id } = req.params; // Get the ID from the URL parameters

  try {
    const newTaskQuery = `DELETE FROM todo WHERE id = $1 RETURNING *`;
    const result = await pool.query(newTaskQuery, [id]);
    // if task with id does not exist
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task", error);
    res.status(500).json({ error: "Error deleting task" });
  }
};

// update

const updateTask = async (req, res) => {
  // grab id
  // pass new task text
  // return updated task

  const { id } = req.params;
  const { task } = req.body;

  try {
    const newTaskQuery = `UPDATE todo SET task = $1 WHERE id = $2 RETURNING *`;
    const result = await pool.query(newTaskQuery, [task, id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating task", error);
    res.status(500).json({ error: "Error updating task" });
  }
};

app.get("/all", getAll);
app.post("/create-table", createTable);
app.post("/add", addTask);
app.delete("/delete/:id", deleteTask);
app.patch("/update/:id", updateTask);

app.listen(port, () => {
  console.log(`Server listening at port: ${port}`);
});
