// File: js/app.js
// Student: awskhader (12324525)
// This file is intentionally incomplete.
// Your task is to implement the required behaviour using JavaScript and the Fetch API.

/*
  API ENDPOINTS (already implemented on the server):

  Base URL:
    http://portal.almasar101.com/assignment/api

  1) Add task  (POST)
     add.php?stdid=STUDENT_ID&key=API_KEY
     Body (JSON): { "title": "Task title" }
     Returns JSON with the added task.

  2) Get tasks (GET)
     get.php?stdid=STUDENT_ID&key=API_KEY
     - If "id" is omitted: returns all tasks for this student.
     - If "id=NUMBER" is provided: returns one task.

  3) Delete task (GET or DELETE)
     delete.php?stdid=STUDENT_ID&key=API_KEY&id=TASK_ID
     Deletes the task with that ID for the given student.
*/

// Configuration for this student (do not change STUDENT_ID value)
const STUDENT_ID = "12324525";
const API_KEY = "nYs43u5f1oGK9";
const API_BASE = "https://portal.almasar101.com/assignment/api";

// Grab elements from the DOM
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const statusDiv = document.getElementById("status");
const list = document.getElementById("task-list");

/**
 * Helper to update status message.
 * You can use this in your code.
 */
function setStatus(message, isError = false) {
  if (!statusDiv) return;
  statusDiv.textContent = message || "";
  statusDiv.style.color = isError ? "#d9363e" : "#666666";
}

/**
 * TODO 1:
 * When the page loads, fetch all existing tasks for this student
 */
document.addEventListener("DOMContentLoaded", function () {
  setStatus("Loading tasks...");

  const url = API_BASE + "/get.php?stdid=" + STUDENT_ID + "&key=" + API_KEY;

  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to load tasks");
      return res.json();
    })
    .then((data) => {
      if (data.tasks && Array.isArray(data.tasks)) {
        data.tasks.forEach((task) => {
          renderTask(task);
        });
      }
      setStatus("");
    })
    .catch((err) => {
      console.error(err);
      setStatus(err.message, true);
    });
});

/**
 * TODO 2:
 * Handle form submission and add new task
 */
if (form) {
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = input.value.trim();
    if (!title) return;

    setStatus("Adding task...");

    const url = API_BASE + "/add.php?stdid=" + STUDENT_ID + "&key=" + API_KEY;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: title }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add task");
        return res.json();
      })
      .then((data) => {
        if (data.success && data.task) {
          renderTask(data.task);
          input.value = "";
          setStatus("Task added");
        } else {
          throw new Error("Error adding task");
        }
      })
      .catch((err) => {
        console.error(err);
        setStatus(err.message, true);
      });
  });
}

/**
 * TODO 3:
 * Render task and handle delete
 */
function renderTask(task) {
  const li = document.createElement("li");
  li.className = "task-item";

  const span = document.createElement("span");
  span.textContent = task.title;

  const btn = document.createElement("button");
  btn.textContent = "Delete";

  btn.addEventListener("click", function () {
    if (!confirm("Delete this task?")) return;

    setStatus("Deleting task...");

    const url =
      API_BASE +
      "/delete.php?stdid=" +
      STUDENT_ID +
      "&key=" +
      API_KEY +
      "&id=" +
      task.id;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete task");
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          li.remove();
          setStatus("Task deleted");
        } else {
          throw new Error("Error deleting task");
        }
      })
      .catch((err) => {
        console.error(err);
        setStatus(err.message, true);
      });
  });

  li.appendChild(span);
  li.appendChild(btn);
  list.appendChild(li);
}
