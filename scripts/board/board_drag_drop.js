import {saveData, getLoggedInUser} from '../db.js';
import {updateTasks} from '../board/board.js'

window.draggedTask = null,

window.startDragging = startDragging,
window.dragoverHandler = dragoverHandler,
window.moveToColumn = moveToColumn,
window.highlight = highlight,
window.removeHighlight = removeHighlight,
// window.stopDragging = stopDragging,

document.addEventListener("DOMContentLoaded", () => {});

/**
 * Sets the ID of the task currently being dragged.
 *
 * @param {number|string} taskID - The ID of the task that is being dragged.
 */
function startDragging(taskID) {
    console.log("startDragging", taskID);
    draggedTask = taskID;
    let taskCard = document.getElementById(taskID);
    taskCard.classList.add("card-rotation");
}

/**
 * Enables a drop target by preventing the default behavior.
 *
 * @param {DragEvent} ev - The dragover event object.
 */
function dragoverHandler(ev) {
    ev.preventDefault();
  }

/**
 * Moves the dragged task to a new column (status).
 * Updates the task's status in the user's data and re-renders the board.
 *
 * @param {string} column - The name of the target column.
 */
function moveToColumn(column) {
    let user = getLoggedInUser();
    let taskData = user.tasks[draggedTask];
    taskData.status = `${column}`;
    saveData(`users/${user.id}/tasks`, taskData);
    updateTasks()
  }

//muss noch verändert werden
function highlight(column) {
   let columnArea =  document.getElementById(column);
   if (!columnArea.querySelector("#drag-area")) {
    columnArea.innerHTML += "<div id='drag-area' class='drag-area'></div>";
    }
}

  //ggf. andere Darstellung
// function highlight(column) {
//     let columnTodo = document.getElementById('todo');
//     let columnProgress = document.getElementById('inprogress');
//     let columnReview = document.getElementById('review');
//     if(column == 'todo') {
//         columnProgress.innerHTML += `<div id='drag-${column}' class='drag-area'></div>`;
//     }
//     if(column == 'toprogress') {
//         columnTodo.innerHTML += `<div id='drag-${column}' class='drag-area'></div>`;
//         columnReview.innerHTML += `<div id='drag-${column}' class='drag-area'></div>`;
//     }
// }

  function removeHighlight(column) {
    // let columnArea =  document.getElementById('drag-area');
    // columnArea.remove
  }

//   function stopDragging(taskID) {
//     const taskCard = document.getElementById(taskID);
//     taskCard.classList.remove("card-rotation");
// }