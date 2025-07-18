/**
 * 
 * @returns Returned the template for the icon container in the subtask input field.
 */
function loadSubtaskIcons() {
    return `<img id="close-subtask" onclick="clearSubtaskInput()" src="./assets/icons/close.svg">
            <div class="subtask-divider"></div>
            <img id="done-subtask" onclick="addSubtask()" src="./assets/icons/add_task/done.svg">`
}

/**
 * 
 * @returns Returned the standard template for the subtask input field.
 */
function loadSubtaskIconsDefault() {
    return `<img id="plus-subtask" src="./assets/icons/add_task/plus.svg">`
}

/**
 * 
 * @param {object} contact This is the contact object containing all necessary information. 
 * @returns Returned the template of the menu for the "assigned to".
 */
function loadAssignedMenu(contact) {
   return  `<div class="menu-option" >
                <div class="assigned-username">
                    <div class="badges" style="background-color:${contact.badge.color}">${contact.badge.initials}</div>
                    <p>${contact.name}</p>
                </div>
                <img class="button-transition" data-id="${contact.id}" src="./assets/icons/add_task/default.svg">
            </div>`
}

/**
 * 
 * @param {number} subtaskID This is the ID of the subtask.
 * @param {string} subtaskValue  This is the subtask text.
 * @returns Returned the subtasked template unter the input field.
 */
function loadAddSubtask(subtaskID, subtaskContent) {
    return `<li class="list-subtask" id="subtask(${subtaskID})" onclick="editSubtask(${subtaskID})" contenteditable="false">
                <div class="flex-li">
                    <span id="subtaskContent(${subtaskID})" contenteditable="true">${subtaskContent}</span>
                    <div id="icons-subtask(${subtaskID})" class="edit-bts-subtask" style="display: none;" contenteditable="false">
                        <img class="button-transition" onclick="editIconSubtask(event, ${subtaskID})" id="edit-subtask(${subtaskID})" src="./assets/icons/add_task/edit.svg">
                        <div class="subtask-divider"></div>
                        <img class="button-transition" id="delete-subtask(${subtaskID})" onclick="deleteSubtaskInput(${subtaskID})" src="./assets/icons/add_task/delete.svg">
                    </div>
                </div>
            </li>`
}

/**
 * 
 * @param {number} subtaskID This is the ID of the subtask.
 * @returns Returned the active icons template.
 */
function changeSubtaskIcons(subtaskID) {
    return `<img class="button-transition" id="delete-subtask(${subtaskID})" onclick="deleteSubtaskInput(${subtaskID})" src="./assets/icons/add_task/delete.svg">
            <div class="subtask-divider"></div>
            <img class="button-transition" id="done-subtask(${subtaskID})" src="./assets/icons/add_task/done.svg">`
}

/**
 * 
 * @param {number} subtaskID This is the ID of the subtask.
 * @returns Returned the standard icons. 
 */
function defaultSubtaskIcons(subtaskID) {
    return `<img class="button-transition" onclick="editIconSubtask(event, ${subtaskID})" id="edit-subtask(${subtaskID})" src="./assets/icons/add_task/edit.svg">
            <div class="subtask-divider"></div>
            <img class="button-transition" id="delete-subtask(${subtaskID})" onclick="deleteSubtaskInput(${subtaskID})" src="./assets/icons/add_task/delete.svg">`
}

/**
 * 
 * @returns Returns the template of the feedback.
 */
function loadCreateTaskFeedback() {
    return `<div class="overlay-create-feedback">
                <div id="task-created">
                    <div>Task added to board</div>
                    <img src="./assets/icons/board.svg">        
                </div>
            </div>`
}