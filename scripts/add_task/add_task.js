import { loadData, saveData, getLoggedInUser} from "../db.js";
import { closeOverlay } from "../board/board.js"; 

let subtaskTemplateLoaded = false;
let subtaskID = 0;
export let selectedUsers = new Set(); //Set doesn't allow same elements.
export let selectedPriority = "none";
let selectedTasks = [];
let isColorpickerChanged = false;

window.selectPriority = selectPriority;
window.resetPriority = resetPriority;
window.openAssignedMenu = openAssignedMenu;
window.openCategoryMenu = openCategoryMenu;
window.selectCategory = selectCategory;
window.colorChanged = colorChanged;
window.colorPickerBlur = colorPickerBlur;
window.clearSubtaskInput = clearSubtaskInput;
window.addSubtask = addSubtask;
window.deleteSubtaskInput = deleteSubtaskInput;
window.editSubtask = editSubtask;
window.displaySelectedContacts = displaySelectedContacts;
window.clearTask = clearTask;

/**
 * Initializes application logic after the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", async function() {
    await loadData();
    changeIconsSubtask();
    addCreateTaskEventListener();
    addAssignedEventListener();
    addCategoryEventListener()
});

/**
 * This function is used to change the backgroundcolor of the priority buttons.
 * @param {string} priority
 */
function selectPriority(priority) {
    resetPriority()
    document.getElementById(`bt-${priority}`).classList.add(`bt-${priority}`);
    document.getElementById(`svg-${priority}`).src = `./assets/icons/add_task/Prio_${priority}_white.svg`
    selectedPriority = priority; 
} 

/**
 * This function reset the img source and css.
 */
function resetPriority() {
    let piorities = ['urgent', 'medium', 'low'];
    for (let i = 0; i < piorities.length; i++) {
        document.getElementById(`bt-${piorities[i]}`).classList.remove(`bt-${piorities[i]}`);
        document.getElementById(`svg-${piorities[i]}`).src = `./assets/icons/add_task/Prio_${piorities[i]}.svg`;
    }
    selectedPriority = "none";
}

/**
 * This function open the drop down menu for the category input field with ease-out.
 * 
 */
function openCategoryMenu() {
    let categories = document.getElementById("categories");
    let droptDownImg = document.getElementById("arrow-category");
    if (categories.classList.contains("show")) {
        categories.classList.remove("show");
        droptDownImg.src = "./assets/icons/add_task/arrow_drop_down_down.svg";
    } else {
        categories.classList.add("show");
        droptDownImg.src = "./assets/icons/add_task/arrow_drop_down_up.svg";
    }
}

/**
 * This function changes the category in the input field.
 * @param {string} category Is the select category.
 */
function selectCategory(subtaskNumber) {
    document.getElementById('category-colorpicker').classList.remove('hidden')
    if (!isColorpickerChanged) {
        let subtaskColor = document.getElementById(`category-cpicker-${subtaskNumber}`).value;
        let subtaskText = document.getElementById(`category-text-${subtaskNumber}`).innerText;
        document.getElementById('category-input').value = subtaskText;
        document.getElementById('category-colorpicker').value = subtaskColor;
        document.getElementById("categories").classList.remove("show");
        document.getElementById("arrow-category").src = "./assets/icons/add_task/arrow_drop_down_down.svg";
    }
}

/**
 * This function is called when the color picker is changed.
 */
function colorChanged() {
    isColorpickerChanged = true;
}

/**
 * This function is called when the color picker loses focus (color selected).
 */
function colorPickerBlur() {
    isColorpickerChanged = false;
}

/**
 * This function open the drop down menu for the assigned to input field with ease-out.
 */
function openAssignedMenu() {
    let contacts = document.getElementById("contacts");
    let droptDownImg = document.getElementById("arrow-contacts");
    if (contacts.classList.contains("show")) {
        contacts.classList.remove("show");
        droptDownImg.src = "./assets/icons/add_task/arrow_drop_down_down.svg";
    } else {
        contacts.classList.add("show");
        droptDownImg.src = "./assets/icons/add_task/arrow_drop_down_up.svg";  
    }
    getContactsDatabank('menu-drop-down')
}

/**
 * This function adds an error message to the input fields without any entry.
 */
function checkInputValue() {
    document.querySelectorAll(".error-message").forEach(error => error.remove());
    let requiredFields = document.querySelectorAll("input[required]");
    let isValid = true;
    requiredFields.forEach(field => {
        if (field.value === "") {
            isValid = false
            field.classList.add("error-border");
            let error = document.createElement("p");
            error.classList.add("error-message");
            error.innerText = "This field is required";
            field.parentNode.appendChild(error);
        } else {
            field.classList.remove("error-border");
        }
    });
    return isValid
}

/**
 * This function change the icon plus to close ande done.
 */
function changeIconsSubtask() {
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
 * This function load the menu under the "assigned to" input field.
 * @param {object} data This is a object of the firebase database. 
 */
export async function getContactsDatabank(id) {
    let user = getLoggedInUser();
    let assignedMenu = document.getElementById(id);
    assignedMenu.innerHTML = "";
    for (let contactsIndex = 0; contactsIndex < user.contacts.length; contactsIndex++) {
        if (user.contacts[contactsIndex]) {
            let contact = user.contacts[contactsIndex]
            assignedMenu.innerHTML += loadAssignedMenu(contact);
        }
    }
    selectContact()
    checkSelectedUsers()
}

/**
 * This function sets an event listener on all selected contacts in the dropdown menu.
 */
function selectContact() {
    document.querySelectorAll(".menu-option").forEach((option) => {
        option.addEventListener("click", function () {
            const userId = parseInt(option.querySelector("img").dataset.id);
            toggleUserSelection(userId);
        });
    });
}

/**
 * Toggles the select container a user in the assigned contacts menu.
 * If the user is selected, it ... * 
 * - Changes the background color of the selected contact.
 * - Updates the contact's icon in checked or default.
 * - Adds or removes the user from the `selectedUsers` set.
 * @param {number} userIndex The ID of the contact in the menu.
 */
function toggleUserSelection(userId) {
    let userContainer = document.querySelector(`img[data-id="${userId}"]`);
    let optionOfMenu = userContainer?.closest('.menu-option');
    if (!userContainer || !optionOfMenu) return;

    if (selectedUsers.has(userId)) {
        selectedUsers.delete(userId);
        optionOfMenu.classList.remove('bg-menu-option');
        userContainer.src = "./assets/icons/add_task/default.svg";
    } else {
        selectedUsers.add(userId);
        optionOfMenu.classList.add('bg-menu-option');
        userContainer.src = "./assets/icons/add_task/checked_white.svg";
    }
    displaySelectedContacts();
    checkSelectedUsers();
}

/**
 * This function show the bages of the select contacts above the assign input field.
 */
async function displaySelectedContacts() {
    let selectedContainer = document.getElementById("selected-contacts");
    selectedContainer.innerHTML = "";
    for (let userId of selectedUsers) {
        let contact = getLoggedInUser().contacts[userId];
        if (!contact || !contact.badge) continue;
        selectedContainer.innerHTML += `<div class="badges" style="background-color:${contact.badge.color}">${contact.badge.initials}</div>`;
    }
}

/**
 * Checked if the user already exist in 'selectedUsers' Set.
 * If the user is in the set. it updates the background and image
 */
function checkSelectedUsers() {
    for (let userId of selectedUsers) {
        let userContainer = document.querySelector(`img[data-id="${userId}"]`);
        let optionOfMenu = userContainer?.closest('.menu-option');
        if (!userContainer || !optionOfMenu) continue;

        optionOfMenu.classList.add('bg-menu-option');
        userContainer.src = "./assets/icons/add_task/checked_white.svg";
    }
}

/**
 * Event listener to close the dropdown menu of "assigned to".
 */
export function addAssignedEventListener() {
    let menuContacts = document.getElementById('contacts');
    let inputField = document.getElementById('input-assign'); 
    if (menuContacts && inputField) {
        document.addEventListener("click", function(event) {
        if (!menuContacts.contains(event.target) && event.target !== inputField) {
            menuContacts.classList.remove('show');
        }})
    }
}

/**
 * Event listener to close the dropdown menu of "category".
 */
export function addCategoryEventListener() {
    let menuCategory = document.getElementById('categories');
    let inputField = document.getElementById("category-input"); 
    if (menuCategory && inputField) {
        document.addEventListener("click", function(event) {
        if (!menuCategory.contains(event.target) && event.target !== inputField) {
            menuCategory.classList.remove('show');
        }})
    }
}

/**
 * Event listener to close the dropdown menu of "subtask".
 */
document.addEventListener("click", function (event) {
    document.querySelectorAll("#list-subtasks .list-subtask").forEach((li) => {
        if (!li.contains(event.target)) {
            li.classList.remove("edit-subtask", "subtask-icon-flex");
        }
    });
});

/**
 * Event listener that removes the error message and border from required input fields.
 */
document.addEventListener('click', function (event) {
    if (event.target.matches("input[required]")) {
        event.target.classList.remove("error-border");
        let errorMessage = event.target.parentNode.querySelector(".error-message");
        if (errorMessage) {
            errorMessage.remove();       
        }
    }
});

/**
 * Cleared the entries for the task.
 */
function clearTask() {
    document.querySelector("form").reset();
    document.getElementById('category-colorpicker').classList.add('hidden');
    selectedUsers.clear();
    selectedTasks = [];
    displaySelectedContacts();
    resetPriority()
}

/**
 * Eventlistener for the "create taks" button.
 */
export function addCreateTaskEventListener() {
    let createTaskButton = document.getElementById('bt-create-task');
    if (createTaskButton) {
        createTaskButton.addEventListener('click', async function () {
            if (checkInputValue() === true) {
                await createTask();
                if (window.location.pathname.includes('board.html')) {
                    await loadData();
                    closeOverlay();
                } 
            }
        })
    }; 
}

/**
 * Search the free id for the task.
 * @param {object} tasksData Is the tasks object with all necessary informations.
 * @returns Return the free task id.
 */
function getNextFreeId(tasksData) {
    if (!tasksData) return 0;
    let i = 0;
    while (tasksData[i] != null) {
        i++;
    }
    return i;
}

/**
 * Create a new task and send the information to save function.
 * -Take the informations of the inputfield and the free id and create a object
 * -clear the input fields
 */
export async function createTask() {
    let user = getLoggedInUser();
    let tasksData = user.tasks || {};
    let nextTaskID = getNextFreeId(tasksData);
    let task = {
        id: nextTaskID,
        title: document.getElementById('input-title').value,
        description: document.getElementById('description').value,
        enddate: document.getElementById('input-date').value,
        priority: selectedPriority,
        assignedContacts: getAssignedContacts(user),
        category: getCategoryOfTask(),
        subtasks: getSubtaskOfTask(),
        status: 'todo',
    };
    await saveData(`users/${user.id}/tasks/${task.id}`, task);
    clearTask();
    createTaskFeedback();
}

/**
 * Adds feedback after creating a task
 */
function createTaskFeedback() {
    let container = document.createElement('div');
    container.innerHTML += loadCreateTaskFeedback();
    let overlay = container.querySelector('.overlay-create-feedback');
    document.body.appendChild(overlay);
    let feedback = document.getElementById('task-created');
    overlay.style.display = 'flex';
    feedback.classList.remove('move-in', 'move-out');
    feedback.classList.add('move-in');
    setTimeout(() => {
        feedback.classList.remove('move-in');
        feedback.classList.add('move-out');
    }, 1000);
    setTimeout(() => {
        overlay.style.display = 'none';
        feedback.classList.remove('move-out');
    }, 1500); 
}

/**
 *  Retrieves the selected task category from the input fields.
 * @returns Returns the category obeject with color and name of the category.
 */
export function getCategoryOfTask() {
    let categoryText = document.getElementById('category-input').value;
    let categoryColor = document.getElementById('category-colorpicker').value
    let category = {
        color : categoryColor,
        name : categoryText
    };
    return category
}

/**
 * Retrieves all subtasks from the list and returns them as an array of objects.
 * @returns Array of subtask objects with description and status.
 */
export function getSubtaskOfTask() {
    let liAmount = document.querySelectorAll("#list-subtasks li").length;
    let subtasks = []; 
    for (let subtaskID = 0; subtaskID < liAmount; subtaskID++) {
        let subDescription = document.getElementById(`subtaskContent(${subtaskID})`).innerText;
        let subStatus = "open";
        let subtask = {
            description : subDescription,
            status : subStatus
        }
        subtasks.push(subtask);    
    }
    if (subtasks.length === 0) {
        subtasks = ""
    }
    return subtasks;
}

/**
 * Retrieves the contacts assigned to the currently selected users.
 * @param {object} user This is the object of the logged in user with all informations.
 * @returns Returns the assigned contacts for the task.
 */
export function getAssignedContacts(user) {
    let assignedContactsIDs = Array.from(selectedUsers);
    let assignedContacts = []; 
    for (let index = 0; index < assignedContactsIDs.length; index++) {
        let contactID =  assignedContactsIDs[index];
        let assignedContact = {
            badge : user.contacts[contactID].badge,
            name : user.contacts[contactID].name,
            id : user.contacts[contactID].id
        }
        assignedContacts.push(assignedContact);
    }
    if (assignedContacts.length === 0) {
        assignedContacts = ""
    }
    return assignedContacts;
}