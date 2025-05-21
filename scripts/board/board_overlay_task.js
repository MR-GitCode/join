import {loadData, deleteData, saveData, getLoggedInUser} from '../db.js';
import {addEditTaskEventListener} from "./board_overlay_task_edit.js";
import { updateTasks } from "./board.js";

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
            addSubtasksStatusEventListener(user, taskID);
            addCloseEventListener();
            addEditTaskEventListener(taskID);
            addDeliteTask(user, taskID);
            });
        });
}

/**
 * Deletes the task and reloads the board.
 * @param {object} user This is the object of user with all Informations.
 * @param {number} taskID This is the ID of the task.
 */
async function addDeliteTask(user, taskID) {
    document.getElementById('delete-task').addEventListener("click", async () => {
        await deleteData(`users/${user.id}/tasks/`, taskID);
        closeOverlaySelectTask();
        updateTasks();       
    })
}

/**
 * Changed and saved the subtask status. 
 * @param {object} user This is the object of the user.
 * @param {number} taskID This is the index of the task. 
 */
function addSubtasksStatusEventListener(user, taskID) {
    document.querySelectorAll('.subtask-status').forEach(subtaskImg => {
        subtaskImg.addEventListener("click", () => {
            let doneSrc = './assets/icons/board/done_button.svg'
            let openSrc = './assets/icons/board/open_button.svg'
            let subtaskStatus
            let subtaskId
            if (subtaskImg.src.endsWith('open_button.svg')) {
                subtaskImg.src = doneSrc;
                subtaskStatus = "done";
                subtaskId = subtaskImg.id
            } else {
                subtaskImg.src = openSrc;
                subtaskStatus = "open";
                subtaskId = subtaskImg.id
            }           
            saveData(`users/${user.id}/tasks/${taskID}/subtasks/${subtaskId}/status`, subtaskStatus)
        })
    })
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
            subtaskContainer.innerHTML += loadTaskSubtasks(subtask, indexAssigned);
        }
    } else {
        for (let indexAssigned = 0; indexAssigned < subtasks.length; indexAssigned++) {
            let subtask = subtasks[indexAssigned];
            subtaskContainer.innerHTML += loadAddSubtask(indexAssigned, subtask.description)
        }
    }
}

/**
 * Close the overlay of the task if you click on the cross or outside of the overlay.
 */
export function addCloseEventListener() {
    document.getElementById("overlay-select-task").addEventListener("click", function (event) {
        let overlayContainer = document.querySelector(".content-select-task");
        let closeButton = document.getElementById('close-overlay-select-task');
        if (closeButton.contains(event.target) || (!overlayContainer.contains(event.target) && !event.target.closest('.button-transition'))) {
            closeOverlaySelectTask();
        }
    });
}

/**
 * Closes the "Task" overlay by adding the 'hidden' class. 
 */
export async function closeOverlaySelectTask() {
    document.getElementById('overlay-select-task').classList.add('hidden')
    await loadData();
    updateTasks ()
}