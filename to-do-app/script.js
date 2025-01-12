"use strict";
const titleInput = document.getElementById("title-input");
const descriptionInput = document.getElementById("description-input");
const deadlineInput = document.getElementById("deadline-input");
const taskBtn = document.getElementById("task-button");
const tasksContainer = document.getElementById("tasks-container");
const taskForm = document.getElementById("task-form");
const clearBtn = document.getElementById("clear-button");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-button");
const sortSelect = document.getElementById("sort-select");
const cancelSearchBtn = document.getElementById("cancel-search-button");
const tasksArr = [];
let filteredArr = [];
function validation(inp) {
    return inp.replace(/[<>]/g, '');
}
function addTask() {
    if (titleInput.value.trim() === "") {
        alert("Enter a title");
        return;
    }
    tasksArr.unshift({
        id: `task-${Date.now()}`,
        title: validation(titleInput.value),
        description: validation(descriptionInput.value),
        deadline: validation(deadlineInput.value),
        isDone: false
    });
}
function renderTasks(arr) {
    tasksContainer.innerHTML = ``;
    arr.forEach((item) => {
        tasksContainer.innerHTML += `
    <div class="bg-white rounded-xl border border-gray-200 p-2 shadow-lg relative bg" id="${item.id}">
        <p class="absolute right-1 top-1 text-xs ${item.isDone ? "" : "hidden"}">Done</p>
        <h2 class="text-xl pr-6 break-words title-task">${item.title}</h2>
        <p class="mt-1 break-words description">${item.description}</p>
        <p class="mt-1 break-words deadline">${item.deadline}</p>
        <div class="flex justify-evenly mt-2">
            <button class="rounded-lg bg-blue-500 w-20 text-white shadow-lg delete-button">Delete</button>
            <button class="rounded-lg bg-blue-500 w-20 text-white shadow-lg edit-button">Edit</button>
            <button class="rounded-lg done-button ${item.isDone ? "bg-gray-100 text-black" : "bg-blue-500 text-white"} w-20 shadow-lg">${item.isDone ? "Not Done" : "Done"}</button>
        </div>
    </div>`;
    });
    titleInput.value = '';
    descriptionInput.value = '';
    deadlineInput.value = '';
}
function deleteTask(buttonEl) {
    let deleteTaskIndex = tasksArr.findIndex(item => item.id === buttonEl.parentElement.parentElement.id);
    let filteredDeleteTaskIndex = filteredArr.findIndex(item => item.id === buttonEl.parentElement.parentElement.id);
    tasksArr.splice(deleteTaskIndex, 1);
    filteredArr.splice(filteredDeleteTaskIndex, 1);
    renderTasks(filteredArr.length === 0 ? tasksArr : filteredArr);
}
function doneTask(buttonEl) {
    const task = buttonEl.parentElement.parentElement;
    let doneTaskIndex = tasksArr.findIndex(item => item.id === task.id);
    tasksArr[doneTaskIndex].isDone = !tasksArr[doneTaskIndex].isDone;
    renderTasks(filteredArr.length === 0 ? tasksArr : filteredArr);
}
function editTask(buttonEl) {
    const task = buttonEl.parentElement.parentElement;
    const taskButtons = buttonEl.parentElement;
    const taskTitle = task.querySelector(".title-task");
    const taskDescription = task.querySelector(".description");
    const taskDeadline = task.querySelector(".deadline");
    taskTitle.innerHTML = `<input type="text" class = "w-full rounded-lg border border-gray-200 shadow-lg p-1 focus:outline-none focus:ring-2 focus:ring-blue-500" value="${taskTitle.innerText}">`;
    taskDescription.innerHTML = `<textarea class="w-full rounded-lg border border-gray-200 shadow-lg p-1 focus:outline-none focus:ring-2 focus:ring-blue-500">${taskDescription.innerText}</textarea>`;
    taskDeadline.innerHTML = `<input type="date" class="w-full rounded-lg border border-gray-200 shadow-lg p-1 focus:outline-none focus:ring-2 focus:ring-blue-500" value="${taskDeadline.innerText}">`;
    taskTitle.children[0].focus();
    taskButtons.innerHTML = `
            <button class="rounded-lg bg-blue-500 w-20 text-white shadow-lg cancel-button">Cancel</button>
            <button class="rounded-lg bg-blue-500 w-20 text-white shadow-lg done-edit-button">Edit</button>
    `;
}
function doneEditing(buttonEl) {
    const task = buttonEl.parentElement.parentElement;
    let editedTaskIndex = tasksArr.findIndex(item => item.id === task.id);
    const taskTitle = task.querySelector(".title-task");
    const taskDescription = task.querySelector(".description");
    const taskDeadline = task.querySelector(".deadline");
    tasksArr[editedTaskIndex].title = taskTitle.children[0].value;
    tasksArr[editedTaskIndex].description = taskDescription.children[0].value;
    tasksArr[editedTaskIndex].deadline = taskDeadline.children[0].value;
    renderTasks(filteredArr.length === 0 ? tasksArr : filteredArr);
}
function clearTasks() {
    tasksArr.length = 0;
    sortSelect.selectedIndex = 0;
    searchInput.value = '';
}
function search() {
    filteredArr = tasksArr.filter(item =>
        item.title.toLowerCase().includes(searchInput.value.toLowerCase()) ||
        item.description.toLowerCase().includes(searchInput.value.toLowerCase()) ||
        item.deadline.includes(searchInput.value));
}
function sortArr(value) {
    switch (value) {
        case "title":
            return [...tasksArr].sort((a, b) => a.title.localeCompare(b.title));
        case "deadline":
            return [...tasksArr].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        case "reset":
            sortSelect.selectedIndex = 0;
            return tasksArr;
    }
}
taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addTask();
    renderTasks(filteredArr.length === 0 ? tasksArr : filteredArr);
});
clearBtn.addEventListener("click", () => {
    clearTasks();
    renderTasks(tasksArr);
});
tasksContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-button")) {
        deleteTask(e.target);
    } else if (e.target.classList.contains("edit-button")) {
        editTask(e.target);
    } else if (e.target.classList.contains("done-button")) {
        doneTask(e.target);
    } else if (e.target.classList.contains("cancel-button")) {
        renderTasks(filteredArr.length === 0 ? tasksArr : filteredArr);
    } else if (e.target.classList.contains("done-edit-button")) {
        doneEditing(e.target);
    }
});
searchBtn.addEventListener("click", () => {
    search();
    if (filteredArr.length === 0) {
        tasksContainer.innerHTML = `<h2>Nothing found</h2>`;
    } else {
        renderTasks(filteredArr);
    }
});
cancelSearchBtn.addEventListener("click", () => {
    searchInput.value = '';
    filteredArr.length = 0;
    renderTasks(tasksArr);
});
sortSelect.addEventListener("change", (e) => {
    renderTasks(filteredArr.length === 0 ? sortArr(e.target.value) : filteredArr);
});