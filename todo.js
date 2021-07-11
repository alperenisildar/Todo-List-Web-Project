//chooses all of the necessary items
const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListeners();


function eventListeners(){

    form.addEventListener("submit",addTodo);
    document.addEventListener("DOMContentLoaded",loadAllTodosToUI);
    secCardBody.addEventListener("click", deleteTodo);
    filter.addEventListener("keyup", filterTodos);
    clearButton.addEventListener("click", clearAll);

}

function clearAll(){
    if(confirm("Tümünü silmek istediğinize emin misiniz?")){
        // todoList.innerHTML = ""; //slower
        while(todoList.firstElementChild !== null){
            todoList.removeChild(todoList.firstElementChild);
        }
        localStorage.removeItem("todos");
    }
}

function filterTodos(e){
    const filterValue = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item");

    listItems.forEach(function(listItem){
        const text = listItem.textContent.toLowerCase();
        if(text.indexOf(filterValue) === -1){
            listItem.setAttribute("style", "display:none !important");
        }
        else{
            listItem.setAttribute("style", "display:block");
        }
    })
}

function deleteTodo(e){
    if(e.target.className === "fa fa-remove"){
        e.target.parentElement.parentElement.remove();
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
        showAlert("success", `${e.target.parentElement.parentElement.textContent} silindi`)
    }
}

function deleteTodoFromStorage(deleteTodo){
    
    let todos = getTodosFromStorage();

    todos.forEach(function(todo, index){
        if(todo === deleteTodo){
            todos.splice(index,1); //deleting item from the array
        }
    });

    localStorage.setItem("todos", JSON.stringify(todos));
}

function loadAllTodosToUI(){

    let todos = getTodosFromStorage();

    todos.forEach(function(todo){
        addTodoToUI(todo);
    });
}

function addTodo(e){

    const newTodo = todoInput.value.trim();
    const checking = checkIsThere(newTodo);
    if(newTodo === ""){
        showAlert("danger","Todo alanı boş bırakılamaz");
    }
    else if(checking == true){
        showAlert("warning", `${newTodo} zaten eklenmiş`);
    }
    else{
        showAlert("success", `${newTodo} Başarıyla eklendi`);
        addTodoToUI(newTodo);
        addTodoToStorage(newTodo);
    }
    
    e.preventDefault();
}

function getTodosFromStorage(){
    let todos;

    if(localStorage.getItem("todos") === null){
        todos = [];
    }
    else{
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
}

function checkIsThere(value){
    const valueLower = value.toLowerCase();
    const list = document.querySelectorAll(".list-group-item");
    list.forEach(function(item){
        const text = item.textContent.toLowerCase();
        if(text === valueLower){
            return true;
        }
    })
    return false;
}

function addTodoToStorage(newTodo){
    let todos = getTodosFromStorage();
    todos.push(newTodo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function showAlert(type, message){

    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    firstCardBody.appendChild(alert);
    setTimeout(function(){
        alert.remove();
    },2000);

}

//converts the value it recieves to list item
function addTodoToUI(newTodo){

    //creating list item
    const listItem = document.createElement("li");
    listItem.className = "list-group-item d-flex justify-content-between";
    listItem.appendChild(document.createTextNode(newTodo));
    //creating link
    const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class = 'fa fa-remove'></i>";

    //adding link(textNode) to the item
    listItem.appendChild(link);

    //adding the whole item(textNode) to the list
    todoList.appendChild(listItem);

    todoInput.value = "";
}