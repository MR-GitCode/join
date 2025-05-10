import {loadData, saveData, getLoggedInUser} from '../db.js';
import {selectedUsers, getContactsDatabank} from '../add_task.js';
import { addTaskSubtask } from './board_overlay_task.js';

/**
 * Add a click event listener to the "edit" button.
 */
export function addEditTaskEventListener(taskID) {
    let user = getLoggedInUser();
    let taskInfo = user.tasks[taskID]
    let editTask = document.getElementById('edit-task');
    if(editTask) {
        editTask.addEventListener("click", function(event) {
            event.stopPropagation();
            let taskOverlay = document.getElementById('overlay-select-task');
            taskOverlay.innerHTML = "";
            taskOverlay.innerHTML = loadEditTask(taskInfo);
            editTaskAssigned(taskInfo);
            addAssignedEventListener(taskInfo);
            editPriority(taskInfo);
            addTaskSubtask(taskInfo.subtasks, 'list-subtasks')
        } )
    }
    
}

/**
 * Adds a event listener to the "edit-assigned-menu" element an load contacts in the drop down menu.
 */
function addAssignedEventListener(task) {  
    document.getElementById("edit-assigned-menu").addEventListener("click", function () {
        let contacts = document.getElementById("edit-contacts");
        let droptDownImg = document.getElementById("edit-arrow-contacts");
        if (contacts.classList.contains("show")) {
            contacts.classList.remove("show");
            console.log('drop menu');
            droptDownImg.src = "./assets/icons/add_task/arrow_drop_down_down.svg";
        } else {
            contacts.classList.add("show");
            droptDownImg.src = "./assets/icons/add_task/arrow_drop_down_up.svg";  
        }
        getContactsDatabank('edit-drop-down');
    })
};

/**
 * Displays the assigned contacts for a specific task.
 * @param {object} task The task object containing assigned contact data.
 */
function editTaskAssigned (task) {
    selectedUsers.clear();
    let assignedContacts = task.assignedContacts;
    let assignedContainer = document.getElementById(`selected-contacts`);
    assignedContainer.innerHTML = "";
    for (let assignedID = 0; assignedID < assignedContacts.length; assignedID++) {
        let assignedContact = assignedContacts[assignedID];
        selectedUsers.add(assignedContact.id);
        assignedContainer.innerHTML += loadBagesForCard(assignedContact)
    }
}

/**
 * Changed the background color and the img of the selected priority of the task.
 * @param {object} taskInfo This is the task object with all informations.
 */
function editPriority(taskInfo) {
    let priorityName = taskInfo.priority;
    if (priorityName) {
        document.getElementById(`bt-${priorityName}`).classList.add(`bt-${priorityName}`);
        document.getElementById(`svg-${priorityName}`).src = `./assets/icons/add_task/Prio_${priorityName}_white.svg`;
    }
}