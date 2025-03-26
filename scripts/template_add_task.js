
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
 * @param {image} badge This is the badge image of the user. 
 * @param {string} name This is the name of the user.
 * @param {number} userIndex This is the ID of the user.
 * @returns Returned the template of the menu for the "assigned to".
 */
function loadAssignedMenu(badge, name, userIndex) {
   return  `<div class="menu-option">
            <div class="assigned-username">
                <img src="${badge}">
                <p>${name}</p>
            </div>
            <img id="user(${userIndex})" src="./assets/icons/add_task/default.svg">
            </div> `
}


/**
 * 
 * @param {number} subtaskID This is the ID of the subtask.
 * @param {string} subtaskValue  This is the subtask text.
 * @returns Returned the subtasked template unter the input field.
 */
function loadAddSubtask(subtaskID, subtaskContent) {
    return `<li class="list-subtask" id="subtask(${subtaskID})" onclick="editSubtask(${subtaskID})" contenteditable="true">
                <div class="flex-li">
                    <span id="subtaskContent(${subtaskID})">${subtaskContent}</span>
                    <div id="icons-subtask(${subtaskID})" class="edit-bts-subtask" style="display: none;" contenteditable="false">
                        <img id="edit-subtask(${subtaskID})" src="./assets/icons/add_task/edit.svg">
                        <div class="subtask-divider"></div>
                        <img id="delete-subtask(${subtaskID})" onclick="deleteSubtaskInput(${subtaskID})" src="./assets/icons/add_task/delete.svg">
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
    return `<img id="delete-subtask(${subtaskID})" onclick="deleteSubtaskInput(${subtaskID})" src="./assets/icons/add_task/delete.svg">
            <div class="subtask-divider"></div>
            <img id="done-subtask(${subtaskID})" onclick="sendSubtask(${subtaskID})" src="./assets/icons/add_task/done.svg">`
}

/**
 * 
 * @param {number} subtaskID This is the ID of the subtask.
 * @returns Returned the standard icons. 
 */
function defaultSubtaskIcons(subtaskID) {
    return `<img id="edit-subtask(${subtaskID})" src="./assets/icons/add_task/edit.svg">
            <div class="subtask-divider"></div>
            <img id="delete-subtask(${subtaskID})" onclick="deleteSubtaskInput(${subtaskID})" src="./assets/icons/add_task/delete.svg">`
}