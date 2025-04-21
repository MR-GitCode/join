import {loadData, getTasks} from './db.js';

window.openOverlay = openOverlay,
window.closeOverlay = closeOverlay,

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
    let tasks = getTasks();
        for (let taskIndex = 0; taskIndex < tasks.length; taskIndex++) {
        let taskID = tasks[taskIndex];
        let status = tasks[taskIndex].status;
        let columnOfCard = document.getElementById(`${status}`);
        columnOfCard.innerHTML += loadCard(taskID);
        loadAssignedContacts(taskID)      
    }
    console.log("Aktuelle Tasks:", tasks);
    checkContentOfColumns();
    addTaskEventListeners();
} 

/**
 * Load the bages of the assigned contacts.
 * @param {number} taskID This is the ID of the task.  
 */
function loadAssignedContacts(taskID) {
    let assignedContacts = taskID.assignedContacts;
    let assignedContainer = document.getElementById(`card${taskID.id}-contacts`);
    assignedContainer.innerHTML = "";
    for (let assignedID = 0; assignedID < assignedContacts.length; assignedID++) {
        let assignedContact = assignedContacts[assignedID]
        assignedContainer.innerHTML += loadBagesForCard(assignedContact)
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
            document.getElementById('overlay-select-task').classList.remove('hidden');
            console.log("Task was clicked", taskID);
        });
    });
}

/**
 * Close the overlay of the task if you click on the cross.
 */
document.getElementById('close-overlay-select-task').addEventListener("click", function() {
    console.log("Task closed");
    closeOverlaySelectTask()
} )

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