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
let tasksArr = [];
let renderedArr = [];
let searchedArr = [];
function validation(inp) {
    return inp.replace(/[<>]/g, '');
}
class Task {
    constructor(title, description, deadline) {
        this.id = `task-${Date.now()}`;
        this.title = title;
        this.description = description;
        this.deadline = deadline;
        this.isDone = false;
    }
    doneTask() {
        this.isDone = !this.isDone;
        renderTasks(renderedArr.length === 0 ? tasksArr : renderedArr);
    }
    editTask(task) {
        const taskButtons = task.querySelector(".task-buttons");
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
    doneEditing(task) {
        const taskTitle = task.querySelector(".title-task");
        const taskDescription = task.querySelector(".description");
        const taskDeadline = task.querySelector(".deadline");
        this.title = validation(taskTitle.children[0].value);
        this.description = validation(taskDescription.children[0].value);
        this.deadline = validation(taskDeadline.children[0].value);
        renderTasks(renderedArr.length === 0 ? tasksArr : renderedArr);
    }
    deleteTask() {
        let deleteTaskIndex = tasksArr.findIndex(item => item === this);
        let renderedDeleteTaskIndex = renderedArr.findIndex(item => item === this);
        let searchedDeleteTaskIndex = searchedArr.findIndex(item => item === this);
        tasksArr.splice(deleteTaskIndex, 1);
        renderedArr.splice(renderedDeleteTaskIndex, 1);
        searchedArr.splice(searchedDeleteTaskIndex, 1);
        renderedArr.length === 0 && (searchInput.value = "");
        renderTasks(renderedArr.length === 0 ? tasksArr : renderedArr);
    }
}
function addTask() {
    if (titleInput.value.trim() === "") {
        alert("Enter a title");
        return;
    }
    tasksArr.unshift(new Task(validation(titleInput.value), validation(descriptionInput.value), validation(deadlineInput.value)));
}
function renderTasks(arr) {
    if (arr.length === 0) {
        tasksContainer.innerHTML = `<h2 class="text-gray-500">No tasks to display.</h2>`;
        return;
    }
    tasksContainer.innerHTML = ``;
    arr.forEach((item) => {
        tasksContainer.innerHTML += `
    <div class="bg-white rounded-xl border border-gray-200 p-2 shadow-lg relative bg task" id="${item.id}">
        <p class="absolute right-1 top-1 text-xs ${item.isDone ? "" : "hidden"}">Done</p>
        <h2 class="text-xl pr-6 break-words title-task">${item.title}</h2>
        <p class="mt-1 break-words description">${item.description}</p>
        <p class="mt-1 break-words deadline">${item.deadline}</p>
        <div class="flex justify-evenly mt-2 task-buttons">
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
function clearTasks() {
    tasksArr = tasksArr.filter(item => !renderedArr.includes(item));
    (renderedArr.length === 0 ? tasksArr : renderedArr).length = 0;
    sortSelect.selectedIndex = 0;
    searchInput.value = "";
}
function search() {
    renderedArr = tasksArr.filter(item =>
        item.title.toLowerCase().includes(searchInput.value.toLowerCase()) ||
        item.description.toLowerCase().includes(searchInput.value.toLowerCase()) ||
        item.deadline.includes(searchInput.value));
    searchedArr = [...renderedArr];
}
function sortArr(value) {
    let arr = renderedArr.length === 0 ? tasksArr : renderedArr;
    switch (value) {
        case "title":
            renderedArr = [...arr].sort((a, b) => a.title.localeCompare(b.title));
            break;
        case "deadline":
            renderedArr = [...arr].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
            break;
        case "reset":
            renderedArr = [...searchedArr];
            sortSelect.selectedIndex = 0;
            break;
    }
}
taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addTask();
    renderTasks(renderedArr.length === 0 ? tasksArr : renderedArr);
});
clearBtn.addEventListener("click", () => {
    clearTasks();
    renderTasks(tasksArr);
});
tasksContainer.addEventListener("click", (e) => {
    let task = e.target.closest(".task");
    let triggeredTaskIndex = tasksArr.findIndex(item => item.id === task.id);
    if (e.target.classList.contains("delete-button")) {
        tasksArr[triggeredTaskIndex].deleteTask();
    } else if (e.target.classList.contains("edit-button")) {
        tasksArr[triggeredTaskIndex].editTask(task);
    } else if (e.target.classList.contains("done-button")) {
        tasksArr[triggeredTaskIndex].doneTask();
    } else if (e.target.classList.contains("cancel-button")) {
        renderTasks(renderedArr.length === 0 ? tasksArr : renderedArr);
    } else if (e.target.classList.contains("done-edit-button")) {
        tasksArr[triggeredTaskIndex].doneEditing(task);
    }
});
searchBtn.addEventListener("click", () => {
    search();
    if (renderedArr.length === 0) {
        tasksContainer.innerHTML = `<h2>Nothing found</h2>`;
    } else {
        renderTasks(renderedArr);
    }
});
cancelSearchBtn.addEventListener("click", () => {
    searchInput.value = '';
    renderedArr.length = 0;
    searchedArr.length = 0;
    sortSelect.selectedIndex = 0;
    renderTasks(tasksArr);
});
sortSelect.addEventListener("change", (e) => {
    sortArr(e.target.value);
    renderTasks(renderedArr.length === 0 ? tasksArr : renderedArr);
});