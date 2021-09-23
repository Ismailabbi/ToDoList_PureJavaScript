
let todoItems  = []


window.addEventListener("load", loadJSON(function(response) {
    var actual_Json = JSON.parse(response)
    todoItems =actual_Json.todoItems
    todoItems.forEach(renderTodo)
})
);

function addItem(text ) {

const todoItem = {
    text ,
    checked : false ,
    id : Date.now()
}
 todoItems.push(todoItem)
 writeItemInJson(todoItem)
 renderTodo(todoItem)

}

const form = document.querySelector('.js-form')
form.addEventListener('submit',event => {
event.preventDefault()
const input = document .querySelector(".js-todo-input")
const text = input.value
if(text !== '' ) {
    addItem(text)
    input.value = ''
    input.focus()
}

})


function renderTodo(todo) {
    localStorage.setItem('todoItemsRef', JSON.stringify(todoItems));
    const ref = localStorage.getItem('todoItemsRef')
    const list = document.querySelector('.js-todo-list')
    const item = document.querySelector(`[data-key='${todo.id}']`)
    if (todo.deleted) {
        item.remove() ;
        return
    }
    const isCheked = todo.checked ? 'done' : ''
    const node = document.createElement("li")
    node.setAttribute('class',`todo-item ${isCheked}`)
    node.setAttribute('data-key',todo.id)
    node.innerHTML = `
    <span>${todo.text}</span>
    <span class="delete-todo js-delete-todo close">x
    </span>
  `;

  // Append the element to the DOM as the last child of
  // the element referenced by the `list` variable
 

  if(item) {
      list.replaceChild(node , item)
  }
 else {
     list.append(node)
 }

}

const list = document.querySelector('.js-todo-list')
list.addEventListener('click',event => {

    if(event.target.classList.contains('todo-item')) {
       const itemkey = event.target.dataset.key
       toggleDone(itemkey)
    }

   
    if(event.target.classList.contains('js-delete-todo')) {
        const itemKey = event.target.parentElement.dataset.key
        deleteTodo(itemKey)
    }
})

function deleteTodo(key) {

    const index = todoItems.findIndex(item => item.id === Number(key))

    const todo = {
        deleted : true ,
        ...todoItems[index]
    }

    todoItems = todoItems.filter(item => item.id !== Number(key))

    renderTodo(todo)
}

function toggleDone(key) {
    const index = todoItems.findIndex(item => item.id === Number(key))

   
    todoItems[index].checked = !todoItems[index].checked

    renderTodo(todoItems[index])

}



function loadJSON(callback) {   

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', 'my_data.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }


function writeItemInJson(item) {
    
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('POST', 'my_data.json', true); // Replace 'my_data' with the path to your file
    xobj.send(JSON.stringify(item))
}

