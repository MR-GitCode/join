import {loadData, saveData, getLoggedInUser} from '../db.js';
import {addEditTaskEventListener} from "./board_overlay_task_edit.js";

window.closeOverlaySelectTask = closeOverlaySelectTask,

document.addEventListener("DOMContentLoaded", async () => {});

/**
  * Open the overlay of the task if you click on the taskcard.
  */
export function addTaskEventListeners() {
    document.querySelectorAll(".card").forEach(task => {
        task.addEventListener("click", () => {
            let taskID = task.id;
            let taskContainer = document.getElementById('overlay-select-task')
            taskContainer.classList.remove('hidden');
            let user = getLoggedInUser();           
            taskContainer.innerHTML = loadTaskOverlay(user.tasks[taskID]);
            addTaskAssigned(user.tasks[taskID]);
            addTaskSubtask(user.tasks[taskID].subtasks, 'subtasks-select-task', 'show');
            addCloseEventListener();
            addEditTaskEventListener(taskID);
            });
        });
}

/**
 * Load the assigned contacts for the task.
 * @param {object} task This a object of the task. 
 */
function addTaskAssigned(task) {
    let assignedContainer = document.getElementById('assigned-select-task');
    let assignedContacts = task.assignedContacts;
    for (let indexAssigned = 0; indexAssigned < assignedContacts.length; indexAssigned++) {
        let contact = assignedContacts[indexAssigned]
        assignedContainer.innerHTML += loadTaskAssigned(contact)
    }
}

/**
 * Load the subtask for the selected task.
 * @param {object} task  The task object containing all necessary task details.
 */
export function addTaskSubtask(subtasks, subtaskContainerID, checkValue) {
    let subtaskContainer = document.getElementById(subtaskContainerID)
    if (checkValue === 'show') { 
        for (let indexAssigned = 0; indexAssigned < subtasks.length; indexAssigned++) {
            let subtask = subtasks[indexAssigned];
            subtaskContainer.innerHTML += loadTaskSubtasks(subtask);
        }
    } else {
        for (let indexAssigned = 0; indexAssigned < subtasks.length; indexAssigned++) {
            let subtask = subtasks[indexAssigned];
            subtaskContainer.innerHTML += loadAddSubtask(indexAssigned, subtask.description)
        }
    }
}

/**
 * Close the overlay of the task if you click on the cross.
 */
function addCloseEventListener() {
    let closeButton = document.getElementById('close-overlay-select-task');
    if(closeButton) {
        closeButton.addEventListener("click", function() {
        closeOverlaySelectTask()
    } )
    }
}

/**
  * Closes the overlay of the task when a click occurs outside the content area (".content-select-task").
  */
document.getElementById("overlay-select-task").addEventListener("click", function (event) {
    let overlayContainer = document.querySelector(".content-select-task");
    if (!overlayContainer.contains(event.target)) {
        closeOverlaySelectTask()
    }
});

/**
 * Closes the "Task" overlay by adding the 'hidden' class. 
 */
function closeOverlaySelectTask() {
    document.getElementById('overlay-select-task').classList.add('hidden')
}