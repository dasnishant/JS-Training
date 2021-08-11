var todoArray = JSON.parse(localStorage.getItem("todos"));
var todosCompletedCount = 0;
var tabName = localStorage.getItem("tabName");
console.log(tabName);
if (!todoArray) {
  todoArray = [];
}
window.onload = function () {
  // console.log(todoArray);
  const todoInput = document.getElementById("todoInput");
  const todoList = document.getElementById("todoList");
  const toggleAll = document.getElementById("toggleAll");
  const footer = document.getElementById("footer");

  todoArray.map((_todo, index) => {
    if (_todo.completed) {
      todosCompletedCount++;
    }
    addTodo(index);
  });

  if (localStorage.getItem("tabName") === "Active") {
    displayActiveTodos();
  } else if (localStorage.getItem("tabName") === "Completed") {
    displayCompletedTodos();
  }

  todoInput.onkeypress = function (event) {
    if (event.key == "Enter") {
      let input = event.target.value;
      if (!(input.trim() === "")) {
        todoArray.push({ id: Date.now(), todo: input, completed: false });
        localStorage.setItem("todos", JSON.stringify(todoArray));
        addTodo();
      } else {
        alert("Some text input required");
      }
    }
  };

  function addClearCompletedListener() {
    document.getElementById("clearCompleted").onclick = function () {
      let todoCopyArray = [];
      todoArray.map((_todo) => {
        if (_todo.completed) {
          document.getElementById(_todo.id).remove();
          todosCompletedCount--;
          if (todosCompletedCount == 0) {
            document.getElementById("clearCompleted").style.display = "none";
          }
        } else {
          todoCopyArray.push(_todo);
        }
      });
      todoArray = todoCopyArray;
      localStorage.setItem("todos", JSON.stringify(todoArray));
      if (todoArray.length == 0) {
        todosCompletedCount = 0;
        while (toggleAll.firstChild) {
          toggleAll.removeChild(toggleAll.firstChild);
        }
        while (footer.firstChild) {
          footer.removeChild(footer.firstChild);
        }
      } else {
        document.getElementById("itemsLeft").innerText = `${
          todoArray.length - todosCompletedCount
        } items left`;
      }
      console.log(todoArray);
    };
  }

  function addToggleAllCheckbox() {
    let input = document.createElement("input");
    input.type = "checkbox";
    input.id = "toggleAllCheckbox";
    let i = document.createElement("i");
    i.for = "toggleAllCheckbox";
    i.classList.add("arrow");
    i.classList.add("down");
    toggleAll.appendChild(input);
    toggleAll.appendChild(i);

    toggleAll.onclick = function (event) {
      var parentElement = event.target.parentElement;
      var input = parentElement.querySelector("input");
      input.checked = !input.checked;

      if (input.checked) {
        todoArray.map((_todo) => {
          _todo.completed = true;
          document
            .getElementById(_todo.id)
            .querySelector("input").checked = true;
          document
            .getElementById(_todo.id)
            .querySelector("p").style.textDecoration = "line-through";
        });
        todosCompletedCount = todoArray.length;
      } else {
        todoArray.map((_todo) => {
          _todo.completed = false;
          document
            .getElementById(_todo.id)
            .querySelector("input").checked = false;
          document
            .getElementById(_todo.id)
            .querySelector("p").style.textDecoration = "none";
        });
        todosCompletedCount = 0;
      }

      localStorage.setItem("todos", JSON.stringify(todoArray));
      if (localStorage.getItem("tabName") === "Active") {
        displayActiveTodos();
      } else if (localStorage.getItem("tabName") === "Completed") {
        displayCompletedTodos();
      }
      document.getElementById("itemsLeft").innerText = `${
        todoArray.length - todosCompletedCount
      } items left`;
      if (todosCompletedCount > 0) {
        document.getElementById("clearCompleted").style.display = "flex";
      } else {
        document.getElementById("clearCompleted").style.display = "none";
      }
    };
  }

  function displayAllTodos(event) {
    localStorage.setItem("tabName", "All");
    todoArray.map((_todo) => {
      document.getElementById(_todo.id).style.display = "flex";
    });
  }
  function displayActiveTodos(event) {
    localStorage.setItem("tabName", "Active");
    let completedCount = 0;
    todoArray.map((_todo) => {
      if (_todo.completed) {
        document.getElementById(_todo.id).style.display = "none";
        completedCount++;
      } else {
        document.getElementById(_todo.id).style.display = "flex";
      }
    });
  }
  function displayCompletedTodos(event) {
    localStorage.setItem("tabName", "Completed");
    todoArray.map((_todo) => {
      if (_todo.completed) {
        document.getElementById(_todo.id).style.display = "flex";
      } else {
        document.getElementById(_todo.id).style.display = "none";
      }
    });
  }

  function footerOptions() {
    var optionsDiv = document.createElement("div");
    optionsDiv.id = "options";
    var todosLeft = document.createElement("p");
    todosLeft.id = "itemsLeft";
    var todosLeftText = document.createTextNode(
      `${todoArray.length - todosCompletedCount} items left`
    );
    var buttonDiv = document.createElement("div");
    buttonDiv.classList.add("footerButtons");
    var allButton = document.createElement("button");
    var activeButton = document.createElement("button");
    var completedButton = document.createElement("button");
    allButton.classList.add("optionsButton");
    activeButton.classList.add("optionsButton");
    completedButton.classList.add("optionsButton");
    allButton.id = "allButton";
    allButton.innerText = "All";
    activeButton.id = "activeButton";
    activeButton.innerText = "Active";
    completedButton.id = "completedButton";
    completedButton.innerText = "Completed";
    buttonDiv.appendChild(allButton);
    buttonDiv.appendChild(activeButton);
    buttonDiv.appendChild(completedButton);

    var clearCompleted = document.createElement("p");
    clearCompleted.id = "clearCompleted";
    clearCompleted.innerText = "Clear Completed";
    if (todosCompletedCount > 0) {
      clearCompleted.style.display = "inline";
    } else {
      clearCompleted.style.display = "none";
    }

    allButton.onclick = displayAllTodos;
    activeButton.onclick = displayActiveTodos;
    completedButton.onclick = displayCompletedTodos;

    todosLeft.appendChild(todosLeftText);

    optionsDiv.appendChild(todosLeft);
    optionsDiv.appendChild(buttonDiv);
    optionsDiv.appendChild(clearCompleted);

    var smallDiv = document.createElement("div");
    smallDiv.classList.add("small");

    var smallerDiv = document.createElement("div");
    smallerDiv.classList.add("smaller");

    footer.appendChild(optionsDiv);
    footer.appendChild(smallDiv);
    footer.appendChild(smallerDiv);
    addClearCompletedListener();
  }

  function addTodo(index = todoArray.length - 1) {
    var div = document.createElement("div");
    div.classList.add("todoItem");
    div.id = todoArray[index].id;
    var input = document.createElement("input");
    input.type = "checkbox";
    if (todoArray[index].completed) {
      input.checked = true;
    }
    var label = document.createElement("label");
    label.for = "checkbox";
    var para = document.createElement("p");
    if (todoArray[index].completed) {
      para.style.textDecoration = "line-through";
    }
    var textnode = document.createTextNode(todoArray[index].todo);

    var span = document.createElement("span");
    span.innerHTML = "&#x2715";

    para.appendChild(textnode);
    div.appendChild(input);
    div.appendChild(label);
    div.appendChild(para);
    div.appendChild(span);
    todoList.appendChild(div);

    todoInput.value = "";
    // console.log(todoArray);

    if (!toggleAll.hasChildNodes()) {
      addToggleAllCheckbox();
      footerOptions();
    }

    if (footer.hasChildNodes()) {
      document.getElementById("itemsLeft").innerText = `${
        todoArray.length - todosCompletedCount
      } items left`;
    }

    if (localStorage.getItem("tabName") === "Active") {
      displayActiveTodos();
    } else if (localStorage.getItem("tabName") === "Completed") {
      displayCompletedTodos();
    }

    div.onmouseenter = function (event) {
      var deleteBtn = event.target.querySelector("span");
      deleteBtn.style.display = "inline";
    };

    div.onmouseleave = function (event) {
      var deleteBtn = event.target.querySelector("span");
      deleteBtn.style.display = "none";
    };
  }

  todoList.onclick = function (event) {
    const item = event.target;
    // console.log(item.tagName);

    if (item.tagName === "LABEL") {
      const todoItem = item.parentElement;
      const todoId = item.parentElement.id;
      const input = todoItem.querySelector("input");
      input.checked = !input.checked;
      const todoText = todoItem.querySelector("p");
      if (input.checked) {
        todoArray.map((_todo) => {
          // console.log(_todo.id, todoId);
          if (_todo.id == todoId) {
            _todo.completed = true;
            todosCompletedCount++;
            document.getElementById("itemsLeft").innerText = `${
              todoArray.length - todosCompletedCount
            } items left`;
            if (todosCompletedCount > 0) {
              document.getElementById("clearCompleted").style.display = "flex";
            }
          }
        });
        localStorage.setItem("todos", JSON.stringify(todoArray));
        console.log(todoArray);

        if (localStorage.getItem("tabName") === "Active") {
          displayActiveTodos();
        }
        todoText.style.textDecoration = "line-through";
      } else {
        todoArray.map((_todo) => {
          if (_todo.id == todoId) {
            _todo.completed = false;
            todosCompletedCount--;
            document.getElementById("itemsLeft").innerText = `${
              todoArray.length - todosCompletedCount
            } items left`;
            if (todosCompletedCount == 0) {
              document.getElementById("clearCompleted").style.display = "none";
            }
          }
        });
        localStorage.setItem("todos", JSON.stringify(todoArray));
        console.log(todoArray);

        if (localStorage.getItem("tabName") === "Completed") {
          displayCompletedTodos();
        }

        todoText.style.textDecoration = "none";
      }
    }

    if (item.tagName === "SPAN") {
      const todoItem = item.parentElement;
      const todoId = item.parentElement.id;
      todoArray = todoArray.filter((_todo) => {
        if (_todo.completed && _todo.id == todoId) {
          todosCompletedCount--;
          if (
            todosCompletedCount == 0 &&
            document.getElementById("clearCompleted")
          ) {
            document.getElementById("clearCompleted").style.display = "none";
          }
        }
        return _todo.id != todoId;
      });
      localStorage.setItem("todos", JSON.stringify(todoArray));
      todoItem.remove();

      console.log(todosCompletedCount);

      if (todoArray.length === 0) {
        while (toggleAll.firstChild) {
          toggleAll.removeChild(toggleAll.firstChild);
        }
        while (footer.firstChild) {
          footer.removeChild(footer.firstChild);
        }
        todosCompletedCount = 0;
      } else {
        document.getElementById("itemsLeft").innerText = `${
          todoArray.length - todosCompletedCount <= 0
            ? 0
            : todoArray.length - todosCompletedCount
        } items left`;
      }

      console.log(todoArray);
    }
  };
};
