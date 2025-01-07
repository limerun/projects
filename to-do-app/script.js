"use strict";
const titleInput = document.getElementById("title-input");
const descriptionInput = document.getElementById("description-input");
const deadlineInput = document.getElementById("deadline-input");
const taskBtn = document.getElementById("task-button");
const tasksContainer = document.getElementById("tasks-container");
const taskForm = document.getElementById("task-form");
const newTask = document.getElementById("new-task");
const clearBtn = document.getElementById("clear-button");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-button");
const sortSelect = document.getElementById("sort-select");
const cancelSearchBtn = document.getElementById("cancel-search-button");
const tasksArr = [];
let filteredArr = [];
function addTask() {
    if (titleInput.value.trim() === "") {
        alert("Enter a title");
        return;
    }
    tasksArr.unshift({
        id: `task-${Date.now()}`,
        title: titleInput.value,
        description: descriptionInput.value,
        deadline: deadlineInput.value,
        isDone: false
    });
}
function renderTasks() {
    tasksContainer.innerHTML = ``;
    const arr = filteredArr ? filteredArr : tasksArr;
    arr.forEach((item) => {
        tasksContainer.innerHTML += `
    <div class="bg-white rounded-xl border border-gray-200 p-2 shadow-lg relative bg" id="${item.id}">
        <p class="absolute right-1 top-1 text-xs hidden">Done</p>
        <h2 class="text-xl pr-6 break-words title-task">${item.title}</h2>
        <p class="mt-1 break-words description">${item.description}</p>
        <p class="mt-1 break-words deadline">${item.deadline}</p>
        <div class="flex justify-evenly mt-2">
            <button class="rounded-lg bg-blue-500 w-20 text-white shadow-lg" onclick="deleteTask(this)">Delete</button>
            <button class="rounded-lg bg-blue-500 w-20 text-white shadow-lg" onclick="editTask(this)">Edit</button>
            <button class="rounded-lg bg-blue-500 w-20 text-white shadow-lg" onclick="doneTask(this)">Done</button>
        </div>
    </div>`;
    });
    titleInput.value = '';
    descriptionInput.value = '';
    deadlineInput.value = '';
}
function deleteTask(buttonEl) {
    let deleteTaskIndex = tasksArr.findIndex(item => item.id === buttonEl.parentElement.parentElement.id);
    tasksArr.splice(deleteTaskIndex, 1);
    filteredArr.splice(deleteTaskIndex, 1);
    renderTasks();
}
function doneTask(buttonEl) {
    const taskContainer = buttonEl.parentElement.parentElement;
    taskContainer.querySelector("p.absolute").classList.toggle("hidden");
    buttonEl.classList.toggle("bg-gray-100");
    buttonEl.classList.toggle("text-black");
    buttonEl.innerText = (buttonEl.innerText === "Done") ? "Not Done" : "Done";
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
            <button class="rounded-lg bg-blue-500 w-20 text-white shadow-lg" onclick="renderTasks()">Cancel</button>
            <button class="rounded-lg bg-blue-500 w-20 text-white shadow-lg" onclick="doneEditing(this)">Edit</button>
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
    renderTasks();
}
taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addTask();
    renderTasks();
});
clearBtn.addEventListener("click", () => {
    tasksArr.length = 0;
    sortSelect.selectedIndex = 0;
    searchInput.value = '';
    renderTasks();
});
searchBtn.addEventListener("click", () => {
    filteredArr = tasksArr.filter(item => item.title.includes(searchInput.value) || item.description.includes(searchInput.value) || item.deadline.includes(searchInput.value));
    if (filteredArr.length === 0) {
        tasksContainer.innerHTML = `<h2>Nothing found<h2>`;
    } else {
        renderTasks();
    }
});
cancelSearchBtn.addEventListener("click", () => {
    searchInput.value = '';
    filteredArr.length = 0;
    renderTasks();
});