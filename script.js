document.addEventListener("DOMContentLoaded", function () {
  const todoInput = document.getElementById("todo-input");
  const dateInput = document.getElementById("date-input");
  const addBtn = document.getElementById("add-btn");
  const todoList = document.getElementById("todo-list");
  const filterSelect = document.getElementById("filter-select");

  let todos = JSON.parse(localStorage.getItem("todos")) || [];

 
  renderTodos();


  addBtn.addEventListener("click", addTodo);
  todoInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") addTodo();
  });


  filterSelect.addEventListener("change", renderTodos);

  function addTodo() {
    const task = todoInput.value.trim();
    const date = dateInput.value;

    if (!task) {
      alert("Please enter a task");
      return;
    }

    if (!date) {
      alert("Please select a date");
      return;
    }

    const newTodo = {
      id: Date.now(),
      task,
      date,
      completed: false,
    };

    todos.push(newTodo);
    saveTodos();
    renderTodos();

   
    todoInput.value = "";
    dateInput.value = "";
  }

  function renderTodos() {
    const filter = filterSelect.value;
    const today = new Date().toISOString().split("T")[0];

    let filteredTodos = todos;

    if (filter === "today") {
      filteredTodos = todos.filter((todo) => todo.date === today);
    } else if (filter === "upcoming") {
      filteredTodos = todos.filter((todo) => todo.date > today);
    } else if (filter === "past") {
      filteredTodos = todos.filter(
        (todo) => todo.date < today && !todo.completed
      );
    }

    todoList.innerHTML = "";

    filteredTodos.forEach((todo) => {
      const li = document.createElement("li");
      li.className = "todo-item";

      
      if (todo.date < today && !todo.completed) {
        li.classList.add("past");
      } else if (todo.date === today) {
        li.classList.add("today");
      } else {
        li.classList.add("upcoming");
      }

      li.innerHTML = `
                <div class="task">${todo.task}</div>
                <div class="date">${formatDate(todo.date)}</div>
                <button class="delete-btn" data-id="${todo.id}">Delete</button>
            `;

      todoList.appendChild(li);
    });

    
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", deleteTodo);
    });
  }

  function deleteTodo(e) {
    const id = parseInt(e.target.getAttribute("data-id"));
    todos = todos.filter((todo) => todo.id !== id);
    saveTodos();
    renderTodos();
  }

  function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  function formatDate(dateString) {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  }
});
