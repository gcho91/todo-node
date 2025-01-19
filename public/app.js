const todoList = document.getElementById("todo-list");
const addTodoForm = document.getElementById("add-todo-form");
const todoTextInput = document.getElementById("todo-text");

// Fetch todos from the server
async function fetchTodos() {
  try {
    const response = await fetch("/todos");
    const todos = await response.json();

    // Clear the list
    todoList.innerHTML = "";

    // Populate the list
    todos.forEach((todo) => {
      const li = document.createElement("li");
      li.textContent = todo.task;

      // Add delete button
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => deleteTodo(todo.id));
      li.appendChild(deleteButton);

      todoList.appendChild(li);
    });
  } catch (error) {
    console.error("Error fetching todos:", error);
  }
}

// Add a new todo
async function addTodo() {
  const todoText = todoTextInput.value;
  if (!todoText) return;

  try {
    await fetch("/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ todoText }),
    });

    todoTextInput.value = ""; // Clear input
    fetchTodos(); // Refresh the list
  } catch (error) {
    console.error("Error adding todo:", error);
  }
}

// Delete a todo
async function deleteTodo(id) {
  try {
    await fetch(`/delete/${id}`, {
      method: "POST",
    });

    fetchTodos(); // Refresh the list
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
}

// Event listeners
addTodoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addTodo();
});

// Initial fetch
fetchTodos();
