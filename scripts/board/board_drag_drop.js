import {saveData, getLoggedInUser} from '../db.js';
import {updateTasks} from '../board/board.js'
import {addTaskEventListeners} from './board_overlay_task.js';

window.draggedTask = null,

window.startDragging = startDragging,
window.dragoverHandler = dragoverHandler,
window.moveToColumn = moveToColumn,
window.highlight = highlight,
window.removeHighlight = removeHighlight,

document.addEventListener("DOMContentLoaded", () => {});

/**
 * Sets the ID of the task currently being dragged.
 *
 * @param {number|string} taskID - The ID of the task that is being dragged.
 */
function startDragging(taskID) {
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
    saveData(`users/${user.id}/tasks/${taskData.id}`, taskData);
    updateTasks();
    removeHighlight(column);
    addTaskEventListeners();
  }

  /**
   * Add and remove a highlight to the drag/drop column.
   * @param {string} column Name of the column.
   */
function highlight(column) {
    let columns = ['todo', 'inprogress', 'review', 'done'];
    columns.forEach(col => {
        let element = document.getElementById(col);
        if (col === column) {
            element.classList.add('highlight-column');
        } else {
            element.classList.remove('highlight-column');
        }
    });
}

/**
 * Remove the highlight for the drop column.
 * @param {string} column Name of the column 
 */
function removeHighlight(column) {
    let element = document.getElementById(column);
    element.classList.remove('highlight-column');
}