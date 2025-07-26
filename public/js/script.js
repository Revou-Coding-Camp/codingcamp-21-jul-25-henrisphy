const BIN_ID = "688449d77b4b8670d8a77aec";
const API_KEY = "$2a$10$DHWEMF32EaokwXUki/IHC.HolKyz1lQXBqDKYrCpsgIAOGvznQUPK";
const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

const todoInput = document.getElementById("todo-input");
const dateInput = document.getElementById("date-input");
const addBtn = document.getElementById("add-btn");
const filterSelect = document.getElementById("filter-select");
const todoList = document.getElementById("todo-list");

document.addEventListener("DOMContentLoaded", loadTodos);

addBtn.addEventListener("click", addTodo);
filterSelect.addEventListener("change", filterTodos);

async function loadTodos() {
  try {
    const response = await fetch(BASE_URL, {
      headers: {
        "X-Master-Key": API_KEY,
      },
    });

    const data = await response.json();
    const todos = data.record || [];

    displayTodos(todos);
  } catch (error) {
    console.error("Error loading todos:", error);
  }
}

function displayTodos(todos) {
  todoList.innerHTML = "";

  const today = new Date().toISOString().split("T")[0];

  const filteredTodos = todos.filter((todo) => {
    const filterValue = filterSelect.value;

    if (filterValue === "all") return true;
    if (filterValue === "today") return todo.date === today;
    if (filterValue === "upcoming") return todo.date > today;
    if (filterValue === "past") return todo.date < today;

    return true;
  });

  filteredTodos.forEach((todo) => {
    const li = document.createElement("li");
    li.innerHTML = `
            <span>${todo.text} <span class="todo-date">${formatDate(
      todo.date
    )}</span></span>
            <button class="delete-btn" data-id="${todo.id}">Delete</button>
        `;
    todoList.appendChild(li);
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", deleteTodo);
  });
}

function formatDate(dateString) {
  if (!dateString) return "";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

async function addTodo() {
  const text = todoInput.value.trim();
  const date = dateInput.value;

  if (!text) {
    alert("Please enter a task");
    return;
  }

  try {
    const response = await fetch(BASE_URL, {
      headers: {
        "X-Master-Key": API_KEY,
      },
    });

    const data = await response.json();
    const todos = data.record || [];

    const newTodo = {
      id: Date.now(),
      text,
      date: date || null,
    };

    const updatedTodos = [...todos, newTodo];

    await fetch(BASE_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": API_KEY,
      },
      body: JSON.stringify(updatedTodos),
    });

    todoInput.value = "";
    dateInput.value = "";
    loadTodos();
  } catch (error) {
    console.error("Error adding todo:", error);
  }
}

async function deleteTodo(e) {
  const id = Number(e.target.dataset.id);

  try {
    const response = await fetch(BASE_URL, {
      headers: {
        "X-Master-Key": API_KEY,
      },
    });

    const data = await response.json();
    const todos = data.record || [];

    const updatedTodos = todos.filter((todo) => todo.id !== id);

    await fetch(BASE_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": API_KEY,
      },
      body: JSON.stringify(updatedTodos),
    });

    loadTodos();
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
}

function filterTodos() {
  loadTodos();
}
