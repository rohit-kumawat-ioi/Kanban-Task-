const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const themeBtn = document.getElementById("themeBtn");

let tasks = JSON.parse(localStorage.getItem("kanban")) || [];


addBtn.addEventListener("click", () => {
  const text = input.value.trim();
  if (!text) return;

  const task = {
    id: Date.now(),
    text: text,
    status: "todo"
  };

  tasks.push(task);
  saveData();
  render();

  input.value = "";
});


function render() {
  const columns = ["todo", "progress", "done"];

  columns.forEach(col => {
    const el = document.getElementById(col);
    el.innerHTML = `<h3>${getTitle(col)}</h3>`;

    // drag events
    el.ondragover = allowDrop;
    el.ondrop = drop;
  });

  tasks.forEach(task => {
    const card = document.createElement("div");
    card.className = "card";
    card.draggable = true;
    card.id = task.id;

    // text
    const span = document.createElement("span");
    span.innerText = task.text;

   
    const delBtn = document.createElement("button");
    delBtn.innerText = "X";

    delBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteTask(task.id);
    });

    card.appendChild(span);
    card.appendChild(delBtn);

    // drag start
    card.addEventListener("dragstart", drag);

    document.getElementById(task.status).appendChild(card);
  });
}


function drag(e) {
  e.dataTransfer.setData("id", e.target.id);
}

function allowDrop(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  const id = e.dataTransfer.getData("id");

  tasks = tasks.map(task => {
    if (task.id == id) {
      task.status = e.currentTarget.id;
    }
    return task;
  });

  saveData();
  render();
}

function deleteTask(id) {
  if (!confirm("Delete this task?")) return;

  tasks = tasks.filter(task => task.id !== id);
  saveData();
  render();
}


function saveData() {
  localStorage.setItem("kanban", JSON.stringify(tasks));
}


let savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");
}

updateThemeText();

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }

  updateThemeText();
});

function updateThemeText() {
  themeBtn.innerText = document.body.classList.contains("dark")
    ? "Light Mode"
    : "Dark Mode";
}


function getTitle(id) {
  if (id === "todo") return "To Do";
  if (id === "progress") return "In Progress";
  return "Done";
}


render();
