const newTodo = document.getElementById("newTodoInput");
const newTodoCheck = document.getElementById("newTodoCheck");
const todoForm = document.getElementById("todoForm");
const todoList = document.getElementById("todoList");
const itemsLeft = document.getElementById("itemsLeft");
const clearCompleted = document.getElementById("clearCompleted");
let todosList = JSON.parse(localStorage.getItem("todosList"));
const radioButtons = document.querySelectorAll(".selection");
const todoListSection = document.getElementById("todoListSection")
// console.log(todosList[0][2])
// localStorage.setItem("todosList", JSON.stringify([]))
console.log('working')
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
loadTodos();

function addTodo(todo) {
  const todoContainer = document.createElement("div");
  todoContainer.classList.add("todo-container");

  const todoMiniContainer = document.createElement("div");

  const todoCheckbox = document.createElement("input");
  todoCheckbox.setAttribute("type", "checkbox");
  todoCheckbox.setAttribute("id", todo[2]);
  todoCheckbox.checked = todo[0];
  todoCheckbox.classList.add("todo-checkbox");

  const todoLabel = document.createElement("label");
  todoLabel.htmlFor = todo[2];
  todoLabel.innerText = todo[1];

  const clearTodo = document.createElement("button");

  const cross = document.createElement("img");
  cross.src = "images/icon-cross.svg";

  todoMiniContainer.appendChild(todoCheckbox);
  todoMiniContainer.appendChild(todoLabel);
  todoContainer.appendChild(todoMiniContainer);
  clearTodo.appendChild(cross);
  todoContainer.appendChild(clearTodo);
  todoList.appendChild(todoContainer);
  updateItemsLeft();
  
}
//update items left
function updateItemsLeft() {
  itemsLeft.innerText = todosList.length;
}

function checkTodo(e) {
  console.log(e.target);
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
    while(todoList.firstChild){
      todoList.firstChild.remove()
    }
    for(let todo of todosList){
      addTodo(todo)
    }
  } else {
    let filteredList = todosList.filter((todo) => todo[0] == isTrue);
    while(todoList.firstChild){
      todoList.firstChild.remove()
    }
    if(filteredList[0]){
      for(let todo of filteredList){
        addTodo(todo)
        itemsLeft.innerText = filteredList.length
      }
    }else{
      itemsLeft.innerText = 0;
    }
  }
  todoCheckboxes = document.querySelectorAll(".todo-checkbox");
  for (let checkbox of todoCheckboxes) {
    checkbox.addEventListener("change", changeStateOfTodo);
  }
}

for (let radioButton of radioButtons) {
  radioButton.addEventListener("change", filterTodos);
}
//Save change of state of todo :D
function changeStateOfTodo(e) {
  for (let todo of todosList) {
    if (todo[2] == e.target.id) {
      todo[0] = e.target.checked;
    }
  }
  console.log("working")
  saveTodos();
}

let todoCheckboxes = document.querySelectorAll(".todo-checkbox");

for (let checkbox of todoCheckboxes) {
  checkbox.addEventListener("change", changeStateOfTodo);
}