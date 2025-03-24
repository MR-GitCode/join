
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