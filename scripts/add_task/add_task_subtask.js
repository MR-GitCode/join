import {selectedTasks} from "../add_task/add_task.js"

let subtaskTemplateLoaded = false;
let subtaskID = 0;

window.clearSubtaskInput = clearSubtaskInput;
window.addSubtask = addSubtask;
window.deleteSubtaskInput = deleteSubtaskInput;
window.editSubtask = editSubtask;
window.editIconSubtask = editIconSubtask;

/**
 * This function change the icon plus to close ande done.
 */
export function changeIconsSubtask() {
    let subtaskIcons = document.getElementById('subtask-input')
    if (subtaskIcons) {
        subtaskIcons.addEventListener("input", function () {
        const subtaskIcons = document.getElementById('subtask-icons'); 
        if (this.value !== "" && !subtaskTemplateLoaded) {
            subtaskIcons.innerHTML = loadSubtaskIcons();
            subtaskTemplateLoaded = true;
        } else if (this.value === "") {
            subtaskIcons.innerHTML = loadSubtaskIconsDefault();
            subtaskTemplateLoaded = false;          
        }
    })}
}

/**
 * This function clears the subtask input field.
 */
function clearSubtaskInput() {
    let clearInput = document.getElementById('subtask-input');
    clearInput.value = ""
}

/**
 * This function add a subtask.
 */
function addSubtask() {
    let subtaskInput = document.getElementById('subtask-input'); 
    if (!subtaskInput.value == "") {
        let subtaskContent = subtaskInput.value; 
        let ulContainer = document.getElementById('list-subtasks');
        ulContainer.innerHTML += loadAddSubtask(subtaskID, subtaskContent);
        selectedTasks.push({id: subtaskID, content: subtaskContent});
        subtaskInput.value = "";
        subtaskID++;
    }  
}

/**
 * This function delete subtask.
 * @param {number} subtaskID This is the ID of the subtask.
 */
function deleteSubtaskInput(subtaskID) {
    let subtask = document.getElementById(`subtask(${subtaskID})`);
    subtask.remove();
}

/**
 * This function edit the subtask and changed the icons.
 * @param {number} subtaskID This is the ID of the subtask.
 */
export function editSubtask(subtaskID) {
    let subtask = document.getElementById(`subtask(${subtaskID})`);
    if (subtask) {
        let subtaskIcons = document.getElementById(`icons-subtask(${subtaskID})`);
        let checkIcon = document.getElementById(`edit-subtask(${subtaskID})`);
        subtask.classList.toggle('edit-subtask');
        if (checkIcon !== null) {
            subtaskIcons.innerHTML = changeSubtaskIcons(subtaskID);
            subtaskIcons.classList.add('subtask-icon-flex');
        } else {
            subtaskIcons.innerHTML = defaultSubtaskIcons(subtaskID);
            subtaskIcons.classList.remove('subtask-icon-flex');
        }
    }
}

/**
 * Sets up a global click listener to manage editing states of subtasks.
 */
document.addEventListener("click", function (event) {
    let clickedLI = event.target.closest(".list-subtask");
    let allSubtasks = document.querySelectorAll(".list-subtask");
    if (!clickedLI) {
        clickOutsideUl(allSubtasks)
    } else {
        clickInsideUl(clickedLI, allSubtasks)
    }
});

/**
 * Resets all subtask list items to non-editable mode.
 * @param {NodeListOf<Element>} allSubtasks All subtask list items to reset.
 */
function clickOutsideUl(allSubtasks) {
    allSubtasks.forEach((li) => {
        li.classList.remove("edit-subtask");
        li.setAttribute("contenteditable", "false");
        let subtaskID = li.id.match(/\d+/)[0];
        let iconDiv = document.getElementById(`icons-subtask(${subtaskID})`);
        if (iconDiv) {
            iconDiv.innerHTML = defaultSubtaskIcons(subtaskID);
            iconDiv.classList.remove("subtask-icon-flex");
        }
        let span = document.getElementById(`subtaskContent(${subtaskID})`);
        if (span && span.textContent.trim() === "") {
           deleteSubtaskInput(subtaskID)
        }
    });
}

/**
 * Enables edit mode for the clicked subtask, disables it for all others.
 * @param {Element} clickedLI The subtask list item that was clicked.
 * @param {NodeListOf<Element>} allSubtasks All subtask list items.
 */
function clickInsideUl(clickedLI, allSubtasks) {
    allSubtasks.forEach((li) => {
        if (li !== clickedLI) {
            li.classList.remove("edit-subtask");
            li.setAttribute("contenteditable", "false");
            let subtaskID = li.id.match(/\d+/)[0];
            let iconDiv = document.getElementById(`icons-subtask(${subtaskID})`);
            if (iconDiv) {
                iconDiv.innerHTML = defaultSubtaskIcons(subtaskID);
                iconDiv.classList.remove("subtask-icon-flex");
            }
        }
    });   
}

/**
 * Activates edit mode for a specific subtask
 * @param {Event} event The click event triggering the edit mode.
 * @param {string|number} subtaskID The ID of the subtask to be edited.
 */
function editIconSubtask(event, subtaskID) {
    event.stopPropagation();
    let subtask = document.getElementById(`subtask(${subtaskID})`);
    let subtaskIcons = document.getElementById(`icons-subtask(${subtaskID})`);
    let allSubtasks = document.querySelectorAll(".list-subtask");
    clickOutsideUl(allSubtasks);
    if (subtask) {
        subtask.classList.add('edit-subtask');
        subtaskIcons.innerHTML = changeSubtaskIcons(subtaskID);
        subtaskIcons.classList.add('subtask-icon-flex');
    }
}