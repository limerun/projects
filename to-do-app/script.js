const titleInput = document.getElementById("title-input");
const descriptionInput = document.getElementById("description-input");
const deadlineInput = document.getElementById("deadline-input");
const taskBtn = document.getElementById("task-button");
const tasksContainer = document.getElementById("tasks-container");
const taskForm = document.getElementById("task-form");
const deleteBtn = document.getElementById("delete-btn");
const newTask = document.getElementById("new-task");
const tasksArr = [];
taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    tasksContainer.innerHTML += `
    <div class="bg-white rounded-xl border border-gray-200 p-2 shadow-lg relative bg" id="${Date.now()}">
        <p class="absolute right-1 top-1 text-xs hidden">Done</p>
        <h2 class="text-xl pr-6 break-words" id="title-h2">${titleInput.value}</h2>
        <p class="mt-1 break-words" id="description-p">${descriptionInput.value}</p>
        <p class="mt-1 break-words" id="deadline-p">${deadlineInput.value}</p>
        <div class="flex justify-evenly mt-2">
            <button class="rounded-lg bg-blue-500 w-20 text-white shadow-lg" id="delete-btn" onclick="deleteTask(this)">Delete</button>
            <button class="rounded-lg bg-blue-500 w-20 text-white shadow-lg" onclick="editTask(this)">Edit</button>
            <button class="rounded-lg bg-blue-500 w-20 text-white shadow-lg" onclick="doneTask(this)">Done</button>
        </div>
    </div>`;
});
function deleteTask(buttonEl) {
    buttonEl.parentElement.parentElement.remove();
}
function doneTask(buttonEl) {
    const taskContainer = buttonEl.parentElement.parentElement;
    taskContainer.querySelector("p.absolute").classList.toggle("hidden");
    buttonEl.classList.toggle("bg-gray-100");
    buttonEl.classList.toggle("text-black");
    buttonEl.innerText = (buttonEl.innerText === "Done") ? "Not Done" : "Done";
}
function editTask(buttonEl) {
    newTask.innerText = "Edit Task";
    taskBtn.innerText = "Edit Task"
    const taskContainer = buttonEl.parentElement.parentElement;
    titleInput.value = taskContainer.querySelector("#title-h2").innerText;
    descriptionInput.value = taskContainer.querySelector("#description-p").innerText;
    deadlineInput.value = taskContainer.querySelector("#deadline-p").innerText;
    buttonEl.classList.toggle("bg-gray-100");
    buttonEl.classList.toggle("text-black");
    taskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        taskContainer.querySelector("#title-h2").innerText = titleInput.value;
    });
}