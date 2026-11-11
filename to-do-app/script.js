"use strict";
const titleInput = document.getElementById("title-input");
const descriptionInput = document.getElementById("description-input");
const deadlineInput = document.getElementById("deadline-input");
const tasksContainer = document.getElementById("tasks-container");
const taskForm = document.getElementById("task-form");
const clearBtn = document.getElementById("clear-button");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-button");
const sortSelect = document.getElementById("sort-select");
const cancelSearchBtn = document.getElementById("cancel-search-button");
let tasksArr = [];
let renderedArr = [];
let searchValue = "";
let sortValue = "reset";
function loadTasks() {
    try {
        const savedTasks = JSON.parse(localStorage.getItem("todoTasks"));
        if (Array.isArray(savedTasks)) {
            tasksArr = savedTasks;
        }
    } catch {
        console.warn("Could not load saved tasks.");
    }
}
function saveTasks() {
    try {
        localStorage.setItem("todoTasks", JSON.stringify(tasksArr));
    } catch {
        console.warn("Could not save tasks.");
    }
}
function validTitle(value) {
    if (value.trim() === "") {
        alert("Enter a title");
        return false;
    }
    return true;
}
function addTask() {
    if (!validTitle(titleInput.value)) {
        return;
    }
    tasksArr.unshift({
        id: `task-${Date.now()}`,
        title: titleInput.value.trim(),
        description: descriptionInput.value,
        deadline: deadlineInput.value,
        isDone: false
    });
    saveTasks();
    taskForm.reset();
}
function renderTasks() {
    renderedArr = tasksArr.filter(item =>
        item.title.toLowerCase().includes(searchValue) ||
        item.description.toLowerCase().includes(searchValue) ||
        item.deadline.includes(searchValue));
    if (sortValue === "title") {
        renderedArr.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortValue === "deadline") {
        renderedArr.sort((a, b) => {
            if (!a.deadline && !b.deadline) return 0;
            if (!a.deadline) return 1;
            if (!b.deadline) return -1;
            return new Date(a.deadline) - new Date(b.deadline);
        });
    }
    if (renderedArr.length === 0) {
        tasksContainer.innerHTML = `<h2 class="text-gray-500">No tasks to display.</h2>`;
        return;
    }
    tasksContainer.innerHTML = ``;
    renderedArr.forEach((item) => {
        const task = document.createElement("div");
        task.innerHTML = `
    <div class="bg-white rounded-xl border border-gray-200 p-2 shadow-lg relative bg" id="${item.id}">
        <p class="absolute right-1 top-1 text-xs ${item.isDone ? "" : "hidden"}">Done</p>
        <h2 class="text-xl pr-6 break-words title-task"></h2>
        <p class="mt-1 break-words description"></p>
        <p class="mt-1 break-words deadline"></p>
        <div class="flex justify-evenly mt-2">
            <button class="rounded-lg bg-blue-500 w-20 text-white shadow-lg delete-button">Delete</button>
            <button class="rounded-lg bg-blue-500 w-20 text-white shadow-lg edit-button">Edit</button>
            <button class="rounded-lg done-button ${item.isDone ? "bg-gray-100 text-black" : "bg-blue-500 text-white"} w-20 shadow-lg">${item.isDone ? "Not Done" : "Done"}</button>
        </div>
    </div>`;
        task.querySelector(".title-task").textContent = item.title;
        task.querySelector(".description").textContent = item.description;
        task.querySelector(".deadline").textContent = item.deadline;
        tasksContainer.append(task.firstElementChild);
    });
}
function deleteTask(buttonEl) {
    let deleteTaskIndex = tasksArr.findIndex(item => item.id === buttonEl.parentElement.parentElement.id);
    tasksArr.splice(deleteTaskIndex, 1);
    saveTasks();
    renderTasks();
}
function doneTask(buttonEl) {
    const task = buttonEl.parentElement.parentElement;
    let doneTaskIndex = tasksArr.findIndex(item => item.id === task.id);
    tasksArr[doneTaskIndex].isDone = !tasksArr[doneTaskIndex].isDone;
    saveTasks();
    renderTasks();
}
function editTask(buttonEl) {
    const task = buttonEl.parentElement.parentElement;
    const taskButtons = buttonEl.parentElement;
    const taskTitle = task.querySelector(".title-task");
    const taskDescription = task.querySelector(".description");
    const taskDeadline = task.querySelector(".deadline");
    const item = tasksArr.find(item => item.id === task.id);
    taskTitle.innerHTML = `<input type="text" class="w-full rounded-lg border border-gray-200 shadow-lg p-1 focus:outline-none focus:ring-2 focus:ring-blue-500">`;
    taskDescription.innerHTML = `<textarea class="w-full rounded-lg border border-gray-200 shadow-lg p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>`;
    taskDeadline.innerHTML = `<input type="date" class="w-full rounded-lg border border-gray-200 shadow-lg p-1 focus:outline-none focus:ring-2 focus:ring-blue-500">`;
    taskTitle.children[0].value = item.title;
    taskDescription.children[0].value = item.description;
    taskDeadline.children[0].value = item.deadline;
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
    if (!validTitle(taskTitle.children[0].value)) {
        return;
    }
    tasksArr[editedTaskIndex].title = taskTitle.children[0].value.trim();
    tasksArr[editedTaskIndex].description = taskDescription.children[0].value;
    tasksArr[editedTaskIndex].deadline = taskDeadline.children[0].value;
    saveTasks();
    renderTasks();
}
function clearTasks() {
    tasksArr = tasksArr.filter(item => !renderedArr.includes(item));
    saveTasks();
}
function search() {
    searchValue = searchInput.value.trim().toLowerCase();
    renderTasks();
}
taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addTask();
    renderTasks();
});
clearBtn.addEventListener("click", () => {
    clearTasks();
    renderTasks();
});
tasksContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-button")) {
        deleteTask(e.target);
    } else if (e.target.classList.contains("edit-button")) {
        editTask(e.target);
    } else if (e.target.classList.contains("done-button")) {
        doneTask(e.target);
    } else if (e.target.classList.contains("cancel-button")) {
        renderTasks();
    } else if (e.target.classList.contains("done-edit-button")) {
        doneEditing(e.target);
    }
});
searchBtn.addEventListener("click", () => {
    search();
});
cancelSearchBtn.addEventListener("click", () => {
    searchInput.value = '';
    searchValue = "";
    sortValue = "reset";
    sortSelect.selectedIndex = 0;
    renderTasks();
});
sortSelect.addEventListener("change", (e) => {
    sortValue = e.target.value;
    renderTasks();
});
loadTasks();
renderTasks();
