import {saveData, getLoggedInUser} from '../db.js';
import {updateTasks} from '../board/board.js'
import {addTaskEventListeners} from './board_overlay_task.js';

let touchMoveElement = null;
window.draggedTask = null,

window.startDragging = startDragging,
window.dragoverHandler = dragoverHandler,
window.moveToColumn = moveToColumn,
window.highlight = highlight,
window.removeHighlight = removeHighlight,
window.touchDragDrop = touchDragDrop,
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
 * 
 * @param {string} column Name of the column 
 */
function removeHighlight(column) {
    let element = document.getElementById(column);
    element.classList.remove('highlight-column');
}

/**
 * Adds mouse and touch drag & drop functionality to a task card element.
 * 
 * @param {HTMLElement} task The Element of the card.
 */
export function touchDragDrop(task) {
    dragStart(task)
    touchStart(task)
    touchMove(task)
    touchEnd(task)
}

/**
 * Adds the dragstart event listener for mouse-based dragging.
 * 
 * @param {HTMLElement} task The Element of the card.
 */
function dragStart(task) {
    task.addEventListener("dragstart", () => {
        startDragging(task.id);
    });
}

/**
 * Adds touchstart event listener to initialize touch dragging.
 * Clones the task element and creates a ghost element to follow the finger.
 * 
 * @param {HTMLElement} task The Element of the card.
 */
function touchStart(task) {
    let touchStartX, touchStartY;
    task.addEventListener("touchstart", (e) => {
        e.preventDefault();
        draggedTask = task.id;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchMoveElement = task.cloneNode(true);
        touchMoveElement.classList.add("touch-drag-ghost");
        touchMoveElement.style.width = `${task.offsetWidth}px`;
        document.body.appendChild(touchMoveElement);
    }, { passive: false });
}

/**
 * Adds touchmove event listener to update the position of the ghost element
 * and highlight potential drop zones (columns) on touch drag.
 * 
 * @param {HTMLElement} task The Element of the card. 
 */
function touchMove(task) {
    task.addEventListener("touchmove", (e) => {
        if (!touchMoveElement) return;
        touchMoveElement.style.left = `${e.touches[0].clientX - touchMoveElement.offsetWidth / 2}px`;
        touchMoveElement.style.top = `${e.touches[0].clientY - touchMoveElement.offsetHeight / 2}px`;
        document.querySelectorAll(".columns-content").forEach(column => {
            let rect = column.getBoundingClientRect();
            let x = e.touches[0].clientX;
            let y = e.touches[0].clientY;
            if (x > rect.left && x < rect.right && y > rect.top && y < rect.bottom) {
                highlight(column.id);
            } else {
                column.classList.remove("highlight-column");
            }
        });
    },{passive: true}); 
}

/**
 * Adds touchend event listener to finalize touch drag.
 * Removes ghost element and moves the card to the drop column if applicable.
 * 
 * @param {HTMLElement} task The Element of the card.
 */
function touchEnd(task) {
    task.addEventListener("touchend", (e) => {
        if (touchMoveElement) {
            document.body.removeChild(touchMoveElement);
            touchMoveElement = null;
        }
        let dropColumn = null;
        document.querySelectorAll(".columns-content").forEach(column => {
            let rect = column.getBoundingClientRect();
            let x = e.changedTouches[0].clientX;
            let y = e.changedTouches[0].clientY;
            if (x > rect.left && x < rect.right && y > rect.top && y < rect.bottom) {
                dropColumn = column.id;
            }
            column.classList.remove("highlight-column");
        });
        if (dropColumn) {
            moveToColumn(dropColumn);
        }
    });
}