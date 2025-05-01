import {loadData, getLoggedInUser} from './db.js';

window.openOverlay = openOverlay,
window.closeOverlay = closeOverlay,
window.closeOverlaySelectTask = closeOverlaySelectTask

/**
 * Load the tasks for the board.
 */
document.addEventListener("DOMContentLoaded", async () => {
    await loadData();
    updateTasks();
});


/**
 * Opens the "Add Task" overlay by removing the 'hidden' class.
 * Triggered when the "Add Task" button is clicked.
 */
function openOverlay() {
    let overlayContainer = document.getElementById("overlay-add-task")
    overlayContainer.classList.remove('hidden');
    document.body.classList.add('no-scroll');
}

/**
 * Closes the "Add Task" overlay by adding the 'hidden' class.
 */
function closeOverlay() {
    let overlayContainer = document.getElementById("overlay-add-task")
    overlayContainer.classList.add('hidden');
    document.body.classList.remove('no-scroll');
}

/**
 * Closes the overlay when a click occurs outside the content area (".content-add-task").
 */
document.getElementById("overlay-add-task").addEventListener("click", function (event) {
    let overlayContainer = document.querySelector(".content-add-task");
    if (!overlayContainer.contains(event.target)) {
        closeOverlay();
    }
});

/**
 * Updates the display of tasks on the board.
 */
function updateTasks() {
    let user = getLoggedInUser();
    let tasksData = user.tasks  
    for (let taskIndex = 0; taskIndex < tasksData.length; taskIndex++) {
        let task = tasksData[taskIndex];
        let status = tasksData[taskIndex].status;
        let columnOfCard = document.getElementById(`${status}`);
        columnOfCard.innerHTML += loadCard(task);
        loadAssignedContacts(task);           
        loadSubtaskBar(task);
        loadPriority(task)     
    }
    console.log("Aktuelle Tasks:", tasksData);
    checkContentOfColumns();
    addTaskEventListeners();
} 

/**
 * Load the progress bar of the subtask an show the amount of the done subtasks.
 * @param {object} task This is the task object containing all necessary information.
 */
function loadSubtaskBar(task) {
    let subtaskContainer = document.getElementById(`progress-bar${task.id}`);
    if (Array.isArray(task.subtasks) && task.subtasks.length > 0) {
        let doneSubtasks = 0;      
        for (let sub of task.subtasks) {
            if (sub.status === "done") {
                doneSubtasks++;}
            }
        subtaskContainer.innerHTML = loadProgressBar(task, doneSubtasks);  
    } else {
        subtaskContainer.innerHTML = "";
    }
}

/**
 * Load the bages of the assigned contacts.
 * @param {object} task This is the object of the task.   
 */
function loadAssignedContacts(task) {
    let assignedContacts = task.assignedContacts;
    let assignedContainer = document.getElementById(`card${task.id}-contacts`);
    assignedContainer.innerHTML = "";
    for (let assignedID = 0; assignedID < assignedContacts.length; assignedID++) {
        let assignedContact = assignedContacts[assignedID]
        assignedContainer.innerHTML += loadBagesForCard(assignedContact)
    }
}

/**
 * Loads and displays the priority icon for a given task.
 * @param {object} task  The task object containing task details.
 */
function loadPriority(task) {
    let priorityContainer = document.getElementById(`priority${task.id}`);
    if (task.priority && task.priority !== "") {
        priorityContainer.innerHTML = loadPriorityImage(task);
    } else {
        priorityContainer.innerHTML = "";
    }
} 

/**
 * Checks each column is empty. If a column is empty, it inserts a placeholder card.
 */
function checkContentOfColumns() {
    let todoContainer = document.getElementById('todo');
    let inprogressContainer = document.getElementById('inprogress');
    let reviewContainer = document.getElementById('review');
    let doneContainer = document.getElementById('done');
    if (todoContainer.innerHTML === "" ) {
        todoContainer.innerHTML = loadNoTodoCard()   
    } 
    if (inprogressContainer.innerHTML === "" ) {
        inprogressContainer.innerHTML = loadNoTodoCard()
    }
    if (reviewContainer.innerHTML === "" ) {
        reviewContainer.innerHTML = loadNoTodoCard()
    }
    if (doneContainer.innerHTML === "" ) {
        doneContainer.innerHTML = loadNoDoneCard()
    }
 }

/**
  * Open the overlay of the task if you click on the taskcard.
  */
function addTaskEventListeners() {
    document.querySelectorAll(".card").forEach(task => {
        task.addEventListener("click", () => {
            let taskID = task.id;
            let taskContainer = document.getElementById('overlay-select-task')
            taskContainer.classList.remove('hidden');
            let user = getLoggedInUser();           
            taskContainer.innerHTML = loadTaskOverlay(user.tasks[taskID]);
            addTaskAssigned(user.tasks[taskID])
            addTaskSubtask(user.tasks[taskID])
            });
        });
        addCloseEventListener()
    };


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
function addTaskSubtask(task) {
    let subtaskContainer = document.getElementById('subtasks-select-task')
    let subtasks = task.subtasks;
    for (let indexAssigned = 0; indexAssigned < subtasks.length; indexAssigned++) {
        let subtask = subtasks[indexAssigned]
        subtaskContainer.innerHTML += loadTaskSubtasks(subtask)
    }
}

/**
 * Close the overlay of the task if you click on the cross.
 */
function addCloseEventListener() {
    document.getElementById('close-overlay-select-task').addEventListener("click", function() {
        closeOverlaySelectTask()
    } )
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