import {loadData, getLoggedInUser} from '../db.js';
import {selectedUsers, addCreateTaskEventListener, addAssignedEventListener, addCategoryEventListener} from '../add_task/add_task.js';
import {addTaskEventListeners} from './board_overlay_task.js';

window.openOverlay = openOverlay;
window.closeOverlay = closeOverlay;

/**
 * Load the tasks for the board.
 */
if (window.location.pathname.endsWith('board.html')) {
    document.addEventListener("DOMContentLoaded", async () => {
        await loadData();
        updateTasks();
        addTaskEventListeners();
        searchingTaskEventListener();
    });
}

/**
 * Opens the "Add Task" overlay by removing the 'hidden' class.
 * Triggered when the "Add Task" button is clicked.
 */
function openOverlay() {
    if (window.innerWidth <= 1000) {
        window.location.href = 'add-task.html';       
    } else {
        selectedUsers.clear();
        let overlayContainer = document.getElementById("overlay-add-task")
        overlayContainer.classList.remove('hidden');
        overlayContainer.innerHTML = loadOverlayAddTaskBoard();
        overlayContainer.classList.add('active');
        document.body.classList.add('no-scroll');
        addAddTaskOverlayEventListener()
    }
}

/**
 * Add event listener to the add task overlay.
 */
function addAddTaskOverlayEventListener() {
    addCloseEventListener();
    addCreateTaskEventListener();
    addAssignedEventListener();
    addCategoryEventListener();
}

/**
 * Closes the overlay when a click occurs outside the content area (".content-add-task") or on the cross.
 */
export function addCloseEventListener() {
    document.getElementById("overlay-add-task").addEventListener("click", function (event) {
        let overlayContainer = document.querySelector(".content-add-task");
        let closeButton = document.getElementById('close-overlay');
        if ((closeButton && closeButton.contains(event.target)) ||
            (overlayContainer && !overlayContainer.contains(event.target) && !event.target.closest('.button-transition'))) {
            closeOverlay();
            addTaskEventListeners()
        }
    });
}

/**
 * Closes the "Add Task" overlay by adding the 'hidden' class.
 */
export function closeOverlay() {
    let overlayContainer = document.getElementById("overlay-add-task");
    overlayContainer.classList.add('hidden');
    document.body.classList.remove('no-scroll');
    overlayContainer.innerHTML = "";
    updateTasks();
}

/**
 * Adds an event listener to the task search input field.
 */
function searchingTaskEventListener() {
    document.getElementById('input-find-task').addEventListener('input', (event) => {
            let findTaskInput = event.target.value.toLowerCase();
            let tasks = getLoggedInUser().tasks;            
            if (findTaskInput.length <2) {
                document.querySelectorAll('.columns-content').forEach(column => {
                    column.innerHTML = "";
                });
                if (findTaskInput === "") {
                    updateTasks()
                } return;
            }
            findTasks(tasks, findTaskInput)
        },
    );
}

/**
 * Find the task matching with the input value
 * @param {object} tasks Object with the informations of the user tasks.
 */
function findTasks(tasks, findTaskInput) {
    let findTask = tasks.filter(task => {
        if (task) {
            return task.title.toLowerCase().includes(findTaskInput) || task.description.toLowerCase().includes(findTaskInput)
        } return false;
    });
    showFindTask(findTask);   
}

/**
 * Displays the filtered tasks in their respective columns based on status.
 * @param {object} findTask  Object of filtered task objects to display.
 */
function showFindTask(findTask) {
    clearColumns();
    for (let taskIndex = 0; taskIndex < findTask.length; taskIndex++) {
        let task = findTask[taskIndex];
        if (task) {
            let status = findTask[taskIndex].status;
            let columnOfCard = document.getElementById(`${status}`);
            columnOfCard.innerHTML += loadCard(task);
            loadAssignedContacts(task);           
            loadSubtaskBar(task);
            loadPriority(task); 
        }
    }
    checkContentOfColumns();
    addTaskEventListeners();
}

/**
 * Updates the display of tasks on the board.
 */
export function updateTasks() {
    let user = getLoggedInUser();
    let tasksData = Object.values(user.tasks);
    clearColumns();
    for (let task of tasksData) {
        if (task) {
            let status = task.status;
            let columnOfCard = document.getElementById(`${status}`);
            columnOfCard.innerHTML += loadCard(task);
            loadAssignedContacts(task);           
            loadSubtaskBar(task);
            loadPriority(task); 
        }
    }
    checkContentOfColumns();
} 

/**
 * Clears the content of all columns
 */
function clearColumns() {
    document.querySelectorAll('.columns-content').forEach(column => {
        column.innerHTML = "";
    });
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
        let percent = doneSubtasks/task.subtasks.length*100;
        subtaskContainer.innerHTML = loadProgressBar(task, doneSubtasks, percent);  
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
    let maxVisible = 5;
    let totalUsers = assignedContacts.length;
    for (let assignedID = 0; assignedID < Math.min(totalUsers, maxVisible); assignedID++) {
        let assignedContact = assignedContacts[assignedID]        
        assignedContainer.innerHTML += loadBagesForCard(assignedContact)
    }
    if (totalUsers > maxVisible) {
        let amount = totalUsers - maxVisible;
        assignedContainer.innerHTML += loadMoreBages(amount);
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
    } if (inprogressContainer.innerHTML === "" ) {
        inprogressContainer.innerHTML = loadNoTodoCard()
    } if (reviewContainer.innerHTML === "" ) {
        reviewContainer.innerHTML = loadNoTodoCard()
    } if (doneContainer.innerHTML === "" ) {
        doneContainer.innerHTML = loadNoDoneCard()
    }
 }