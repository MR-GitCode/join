import {loadData, saveData, getLoggedInUser} from './db.js';

window.draggedTask = null;
window.openOverlay = openOverlay,
window.closeOverlay = closeOverlay,
window.closeOverlaySelectTask = closeOverlaySelectTask,
window.startDragging = startDragging,
window.dragoverHandler = dragoverHandler,
window.moveToColumn = moveToColumn,
window.highlight = highlight,
window.removeHighlight = removeHighlight,
// window.stopDragging = stopDragging,

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
    overlayContainer.classList.add('active');
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
    let tasksData = user.tasks;
    document.querySelectorAll('.columns-content').forEach(column => {
        column.innerHTML = "";
    });
    for (let taskIndex = 0; taskIndex < tasksData.length; taskIndex++) {
        let task = tasksData[taskIndex];
        let status = tasksData[taskIndex].status;
        let columnOfCard = document.getElementById(`${status}`);
        columnOfCard.innerHTML += loadCard(task);
        loadAssignedContacts(task);           
        loadSubtaskBar(task);
        loadPriority(task)     
    }
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
            addTaskAssigned(user.tasks[taskID]);
            addTaskSubtask(user.tasks[taskID]);
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

/**
 * Sets the ID of the task currently being dragged.
 *
 * @param {number|string} taskID - The ID of the task that is being dragged.
 */
function startDragging(taskID) {
    console.log("startDragging", taskID);
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
    saveData(`users/${user.id}/tasks`, taskData);
    updateTasks()
  }

//muss noch verändert werden
function highlight(column) {
   let columnArea =  document.getElementById(column);
   if (!columnArea.querySelector("#drag-area")) {
    columnArea.innerHTML += "<div id='drag-area' class='drag-area'></div>";
    }
}

  //ggf. andere Darstellung
// function highlight(column) {
//     let columnTodo = document.getElementById('todo');
//     let columnProgress = document.getElementById('inprogress');
//     let columnReview = document.getElementById('review');
//     if(column == 'todo') {
//         columnProgress.innerHTML += `<div id='drag-${column}' class='drag-area'></div>`;
//     }
//     if(column == 'toprogress') {
//         columnTodo.innerHTML += `<div id='drag-${column}' class='drag-area'></div>`;
//         columnReview.innerHTML += `<div id='drag-${column}' class='drag-area'></div>`;
//     }
// }

  function removeHighlight(column) {
    // let columnArea =  document.getElementById('drag-area');
    // columnArea.remove
  }

//   function stopDragging(taskID) {
//     const taskCard = document.getElementById(taskID);
//     taskCard.classList.remove("card-rotation");
// }

/**
 * Add a click event listener to the "edit" button.
 */
function addEditTaskEventListener(taskID) {
    let user = getLoggedInUser();
    let taskInfo = user.tasks[taskID]
    let editTask = document.getElementById('edit-task');
    if(editTask) {
        editTask.addEventListener("click", function(event) {
            event.stopPropagation();
            let taskOverlay = document.getElementById('overlay-select-task');
            taskOverlay.innerHTML = "";
            taskOverlay.innerHTML = loadEditTask(taskInfo);
            addAssignedEventListener(taskInfo);
            editTaskAssigned(taskInfo);
        } )
    }
}

function addAssignedEventListener() {
    document.getElementById("edit-assigned-menu").addEventListener("click", function () {
        console.log('drop menu');
        
        // let contacts = document.getElementById("edit-contacts");
        // let droptDownImg = document.getElementById("arrow-contacts");
        // if (contacts.classList.contains("show")) {
        //     contacts.classList.remove("show");
        //     droptDownImg.src = "./assets/icons/add_task/arrow_drop_down_down.svg";
        // } else {
        //     contacts.classList.add("show");
        //     droptDownImg.src = "./assets/icons/add_task/arrow_drop_down_up.svg";  
        // }
        // getContactsDatabank()
    })
};

function editTaskAssigned (task) {
    let assignedContacts = task.assignedContacts;
    let assignedContainer = document.getElementById(`edit-contacts`);
    assignedContainer.innerHTML = "";
    for (let assignedID = 0; assignedID < assignedContacts.length; assignedID++) {
        let assignedContact = assignedContacts[assignedID]
        assignedContainer.innerHTML += loadBagesForCard(assignedContact)
    }
}
