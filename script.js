const newTodo = document.getElementById("newTodoInput");
const newTodoCheck = document.getElementById("newTodoCheck");
const todoForm = document.getElementById("todoForm");
const todoList = document.getElementById("todoList");
const itemsLeft = document.getElementById("itemsLeft");
const clearCompleted = document.getElementById("clearCompleted");
const radioButtons = document.querySelectorAll(".selection");
const todoListSection = document.getElementById("todoListSection");
const themeButton = document.getElementById("themeButton");
let todosList = [];

if (JSON.parse(localStorage.getItem("todosList"))) {
  todosList = JSON.parse(localStorage.getItem("todosList"));
}

function saveNewTodo(e) {
  e.preventDefault();
  let checkValue = newTodoCheck.checked;
  const todoTask = newTodo.value;
  const randomId = Math.floor(Math.random() * 100);

  todosList.push([checkValue, todoTask, randomId]);

  newTodoCheck.checked = false;
  newTodo.value = "";
  saveTodos();
  addTodo(todosList[todosList.length - 1]);
}
function saveTodos() {
  localStorage.setItem("todosList", JSON.stringify(todosList));
}
function loadTodos() {
  for (let todo of todosList) {
    addTodo(todo);
  }
}
if (todosList) {
  loadTodos();
}

function addTodo(todo) {
  const todoContainer = document.createElement("div");
  todoContainer.classList.add("todo-container");
  todoContainer.setAttribute("draggable", true);
  todoContainer.addEventListener("dragstart", draggStart);
  todoContainer.addEventListener("dragend", draggEnd);
  todoContainer.addEventListener("dragover", draggOver);

  todoContainer.addEventListener("touchmove", (e) => {
    draggStart(todoContainer);
    draggOver(e);
  });
  todoContainer.addEventListener("touchend", () => {
    draggEnd(todoContainer);
  });

  const todoMiniContainer = document.createElement("div");

  const todoCheckbox = document.createElement("input");
  todoCheckbox.setAttribute("type", "checkbox");
  todoCheckbox.setAttribute("id", todo[2]);
  todoCheckbox.checked = todo[0];
  todoCheckbox.classList.add("todo-checkbox");
  todoCheckbox.classList.add("peer");

  const todoLabel = document.createElement("label");
  todoLabel.classList.add("dark:text-darkGrayishBlue");
  todoLabel.classList.add("dark:peer-checked:text-darkDarkGrayishBlue");
  todoLabel.htmlFor = todo[2];
  todoLabel.innerText = todo[1];

  const clearTodo = document.createElement("button");
  clearTodo.classList.add("clear-button");
  clearTodo.dataset.todoId = todo[2];

  const cross = document.createElement("img");
  cross.src = "images/icon-cross.svg";

  todoMiniContainer.appendChild(todoCheckbox);
  todoMiniContainer.appendChild(todoLabel);
  todoContainer.appendChild(todoMiniContainer);
  clearTodo.appendChild(cross);
  todoContainer.appendChild(clearTodo);
  todoList.appendChild(todoContainer);
  updateItemsLeft();
  todoCheckbox.addEventListener("change", changeStateOfTodo);
  clearTodo.addEventListener("click", deleteTodo);
}
//update items left
function updateItemsLeft() {
  itemsLeft.innerText = todosList.length;
}
//Start of dragging
function draggStart(todoContainer) {
  todoContainer.classList.add("dragging");
}
//End of dragging
function draggEnd(todoContainer) {
  todoContainer.classList.remove("dragging");
}
//Dragging over
function draggOver(e) {
  e.preventDefault();
  let afterElement = 0
  if(e.type == 'touchmove'){
    let evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
    let touch = evt.touches[0] || evt.changedTouches[0];
    afterElement = getDragAfterElement(touch.pageY);
    console.log(touch.pageY)
  }else {
    afterElement = getDragAfterElement(e.clientY);
    console.log('test')
  }
  const draggable = document.querySelector(".dragging");
  if (afterElement == null) {
    todoList.appendChild(draggable);
  } else {
    todoList.insertBefore(draggable, afterElement);
  }
}
function getDragAfterElement(y) {
  const draggableElements = [
    ...todoList.querySelectorAll(".todo-container:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

//Save change of state of todo :D
function changeStateOfTodo(e) {
  for (let todo of todosList) {
    if (todo[2] == e.target.id) {
      todo[0] = e.target.checked;
    }
  }
  saveTodos();
}

todoForm.addEventListener("submit", saveNewTodo);

//Clear completed Todos
function clearCompletedTodos() {
  for (let todo of todosList) {
    if (todo[0] == true) {
      for (let checkbox of todoCheckboxes) {
        if (todo[2] == checkbox.id) {
          checkbox.parentNode.parentNode.remove();
        }
      }
    }
  }
  todosList = todosList.filter((todo) => todo[0] == false);
  saveTodos();
  updateItemsLeft();
}

clearCompleted.addEventListener("click", clearCompletedTodos);

function filterTodos(e) {
  let isTrue = e.target.value === "true";
  if (e.target.value == "all") {
    while (todoList.firstChild) {
      todoList.firstChild.remove();
    }
    for (let todo of todosList) {
      addTodo(todo);
    }
  } else {
    let filteredList = todosList.filter((todo) => todo[0] == isTrue);
    while (todoList.firstChild) {
      todoList.firstChild.remove();
    }
    if (filteredList[0]) {
      for (let todo of filteredList) {
        addTodo(todo);
        itemsLeft.innerText = filteredList.length;
      }
    } else {
      itemsLeft.innerText = 0;
    }
  }
}

for (let radioButton of radioButtons) {
  radioButton.addEventListener("change", filterTodos);
}

//delete todo

const deleteTodoButtons = document.querySelectorAll(".clear-button");

function deleteTodo(e) {
  console.log(e.target.parentNode.dataset.todoId);
  todosList = todosList.filter(
    (todo) => todo[2] != e.target.parentNode.dataset.todoId
  );

  e.target.parentNode.parentNode.remove();
  saveTodos();
  itemsLeft.innerText -= 1;
}

for (let deleteButton of deleteTodoButtons) {
  deleteButton.addEventListener("click", deleteTodo);
}

function changeTheme() {
  if (localStorage.theme == "light") {
    localStorage.theme = "dark";
    document.documentElement.classList.add("dark");
  } else {
    localStorage.theme = "light";
    document.documentElement.classList.remove("dark");
  }
}

themeButton.addEventListener("click", changeTheme);
