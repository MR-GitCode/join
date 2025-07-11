import {saveData, getLoggedInUser} from '../db.js';
import {selectedUsers, getContactsDatabank, selectedPriority, getAssignedContacts, setMinDateToday } from '../add_task/add_task.js';
import { addTaskSubtask, addCloseEventListener, closeOverlaySelectTask} from './board_overlay_task.js';

/**
 * Stops the event propagation, loads the edit task overlay with task information,
 * and sets up all related UI elements and event listeners for editing the task.
 * @param {Object} taskInfo The information object of the task to edit.
 * @param {Event} event The click event object.
 */
function handleEditTaskClick(taskInfo, event) {
    event.stopPropagation();
    let taskOverlay = document.getElementById('overlay-select-task');
    taskOverlay.innerHTML = "";
    taskOverlay.innerHTML = loadEditTask(taskInfo);
    editInputValue(taskInfo);
    editTaskAssigned(taskInfo);
    addAssignedEventListener(taskInfo);
    editPriority(taskInfo);
    addTaskSubtask(taskInfo.subtasks, 'list-subtasks');
    addEditSubtask();
    addCloseEventListener();
    addEditButtonEventListener(taskInfo);
    setMinDateToday();
}

/**
 * Add a click event listener to the "edit" button.
 * @param {number} taskID The ID of the task.
 */
export function addEditTaskEventListener(taskID) {
    let user = getLoggedInUser();
    let taskInfo = user.tasks[taskID];
    let editTask = document.getElementById('edit-task');
    if (editTask) {
        editTask.addEventListener("click", (event) => handleEditTaskClick(taskInfo, event));
    }
}

/**
 * Adds the text for the respective input field of the task.
 * @param {object} task This is the object of the task with all informations. 
 */
function editInputValue(task) {
    document.getElementById('input-title').value = task.title;
    document.getElementById('description').value = task.description;
    document.getElementById('input-date').value = task.enddate;
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
    renderAssignedBadges(assignedContacts, assignedContainer);
}

/**
 * Renders user badges for assigned contacts.
 * @param {object} assignedContacts Array of assigned contact objects.
 * @param {HTMLElement} assignedContainer The DOM element where badges should be rendered
 */
function renderAssignedBadges(assignedContacts, assignedContainer) {
    let maxVisible = 5;
    let totalUsers = assignedContacts.length;
    for (let assignedID = 0; assignedID < Math.min(totalUsers, maxVisible); assignedID++) {
        let assignedContact = assignedContacts[assignedID];
        selectedUsers.add(assignedContact.id);
        assignedContainer.innerHTML += loadBagesForCard(assignedContact)
    } 
    if (totalUsers > maxVisible) {
        let amount = totalUsers - maxVisible;
        assignedContainer.innerHTML += loadMoreBages(amount);
    }
}

/**
 * Changed the background color and the img of the selected priority of the task.
 * @param {object} taskInfo This is the task object with all informations.
 */
function editPriority(taskInfo) {
    let priorityName = taskInfo.priority;  
    if (priorityName && priorityName !="none") {
        document.getElementById(`bt-${priorityName}`).classList.add(`bt-${priorityName}`);
        document.getElementById(`svg-${priorityName}`).src = `./assets/icons/add_task/Prio_${priorityName}_white.svg`;
    }
}

/**
 * Add a event listener for the ok button and send editing informations to the database.
 * @param {object} taskInfo This is the task object with all informations.
 */
function addEditButtonEventListener (taskInfo) {
    let user = getLoggedInUser();
    document.getElementById('bt-edit').addEventListener("click", async function () {
        let task = editTask(user, taskInfo);    
        await saveData(`users/${user.id}/tasks/${task.id}`, task);
        closeOverlaySelectTask();
    })
}

/**
 * Constructs and returns an updated task object with new values from the edit form.
 * @param {object} user The currently logged-in user.
 * @param {object} taskInfo The original task information being edited.
 * @returns 
 */
function editTask(user, taskInfo) {
    return {
        id: taskInfo.id,
        title: document.getElementById('input-title').value,
        description: document.getElementById('description').value,
        enddate: document.getElementById('input-date').value,
        priority: priorityOfEditTask(taskInfo),
        assignedContacts: getAssignedContacts(user),
        subtasks: getSubtaskOfTaskEdit(taskInfo.subtasks),
        status: taskInfo.status,
        category: taskInfo.category,
    }
}

/**
 * 
 * @param {object} task This is the task object with all informations.
 * @returns Returns the current priority or the new priority. 
 */
function priorityOfEditTask (task) {
    if (selectedPriority === "") {
        return task.priority
    } else {
        return selectedPriority
    }
}

/**
 * This function add a subtask.
 */
function addEditSubtask() {
    document.getElementById('plus-subtask').addEventListener("click", function () {
        let subtaskID = document.querySelectorAll("#list-subtasks li").length;
        let subtaskInput = document.getElementById('subtask-input');
        if (!subtaskInput.value == "") {
            let subtaskContent = subtaskInput.value; 
            let ulContainer = document.getElementById('list-subtasks');
            ulContainer.innerHTML += loadAddSubtask(subtaskID, subtaskContent);
            subtaskInput.value = "";
            addCloseEventListener()
        }
    }) 
}

/**
 * Retrieves the updated subtasks from the edit.
 * @param {object} subtasksInfo The subtasks objects of the task being edited.
 * @returns 
 */
function getSubtaskOfTaskEdit(subtasksInfo) {
    let liAmount = document.querySelectorAll("#list-subtasks li").length;
    let subtasks = [];
    for (let subtaskID = 0; subtaskID < liAmount; subtaskID++) {
        let subtaskElement = document.getElementById(`subtaskContent(${subtaskID})`)         
        subtasks.push({
            description : subtaskElement?.innerText,
            status : getSubtaskStatus(subtasksInfo, subtaskID)
        });
    }
    return subtasks.length? subtasks : "";
}

/**
 * Return the status of the subtask.
 * @param {object} subtasksInfo The object of the subtask with all informations.
 * @param {number} subtaskID Index of the subtask.
 * @returns 
 */
function getSubtaskStatus(subtasksInfo, subtaskID) {
    return subtasksInfo[subtaskID]?.status || "open"; 
}