import {loadData, deleteData, saveData, getLoggedInUser} from '../db.js';
import {addEditTaskEventListener} from "./board_overlay_task_edit.js";
import { updateTasks } from "./board.js";
import { touchDragDrop } from './board_drag_drop.js';

/**
 * Initializes logic after the DOM is fully loaded.
 * Currently calls `addCloseEventListener()` to handle closing overlays
 */
document.addEventListener("DOMContentLoaded", async () => {
    addCloseEventListener()
});

/**
 * Adds event listeners to all task cards.
 */
export function addTaskEventListeners() {
    document.querySelectorAll(".card").forEach(task => {
        task.addEventListener("click", () => {
            let taskID = task.id;
            openTask(taskID);
        });
        touchDragDrop(task);       
    });
}

/**
 * Opens and displays the task overlay for a specific task by its ID.
 * @param {numbe} taskID The ID of the task to display.
 */
export function openTask(taskID) {
    let taskContainer = document.getElementById('overlay-select-task');
    taskContainer.classList.remove('hidden');
    let user = getLoggedInUser();           
    taskContainer.innerHTML = loadTaskOverlay(user.tasks[taskID]);
    addTaskAssigned(user.tasks[taskID]);
    addTaskSubtask(user.tasks[taskID].subtasks, 'subtasks-select-task', 'show');
    addSubtasksStatusEventListener(user, taskID);
    addEditTaskEventListener(taskID);
    addDeleteTask(user, taskID);
}

/**
 * Deletes the task and reloads the board.
 * @param {object} user This is the object of user with all Informations.
 * @param {number} taskID This is the ID of the task.
 */
async function addDeleteTask(user, taskID) {
    document.getElementById('delete-task').addEventListener("click", async () => {
        if(user.tasks.length === 1){
            let userData = getUserData(user);
            await saveData(`users/${user.id}/`, userData);
        } else {            
            await deleteData(`users/${user.id}/tasks/`, taskID);
        }
        closeOverlaySelectTask();   
    })
}

/**
 * Returns a sanitized or defaulted version of the user data object.
 * @param {object} user The object with all user informations
 * @returns 
 */
function getUserData(user) {
    return {
        badge : user.badge || "",
        contacts : user.contacts || "",
        email : user.email || "",
        name : user.name || "",
        password : user.password,
        phone : user.phone || "",
        tasks : ""
    } 
}

/**
 * Adds click event listeners to all subtask status icons in the DOM.
 * @param {object} user This is the object of the user.
 * @param {number} taskID This is the index of the task. 
 */
function addSubtasksStatusEventListener(user, taskID) {
    document.querySelectorAll('.subtask-status').forEach(subtaskImg => {
        subtaskImg.addEventListener("click", () => {
            let {subtaskId, subtaskStatus} = toggleSubtaskImg(subtaskImg);
            saveData(`users/${user.id}/tasks/${taskID}/subtasks/${subtaskId}/status`, subtaskStatus)
        })
    })
}

/**
 * Toggles the image and status of a subtask icon.
 * @param {HTMLImageElement} subtaskImg The image element representing the subtask's status.
 * @returns 
 */
function toggleSubtaskImg(subtaskImg) {
    let doneSrc = './assets/icons/board/done_button.svg';
    let openSrc = './assets/icons/board/open_button.svg';
    let subtaskStatus;
    let subtaskId;
    if (subtaskImg.src.endsWith('open_button.svg')) {
        subtaskImg.src = doneSrc;
        subtaskStatus = "done";
        subtaskId = subtaskImg.id;
    } else {
        subtaskImg.src = openSrc;
        subtaskStatus = "open";
        subtaskId = subtaskImg.id;
    } return {subtaskId, subtaskStatus};
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
    let overlayContainer = document.getElementById("overlay-select-task")
    if (overlayContainer) {
        overlayContainer.addEventListener("click", function (event) {
            let overlayContainer = document.querySelector(".content-select-task");
            let closeButton = document.getElementById('close-overlay-select-task');
            if (closeButton.contains(event.target) || (!overlayContainer.contains(event.target) && !event.target.closest('.button-transition'))) {
                closeOverlaySelectTask();
            }
        });
    }
}

/**
 * Closes the "Task" overlay by adding the 'hidden' class. 
 */
export async function closeOverlaySelectTask() {
    document.getElementById('overlay-select-task').classList.add('hidden')
    await loadData();
    updateTasks();
    addTaskEventListeners();
}