import { loadData, saveData, getLoggedInUser} from "../db.js";
import { closeOverlay } from "../board/board.js";
import { changeIconsSubtask} from "../add_task/add_task_subtask.js"

export let selectedUsers = new Set(); //Set doesn't allow same elements.
export let selectedPriority = "medium";
export let selectedTasks = [];
let isColorpickerChanged = false;

window.selectPriority = selectPriority;
window.resetPriority = resetPriority;
window.openAssignedMenu = openAssignedMenu;
window.openCategoryMenu = openCategoryMenu;
window.selectCategory = selectCategory;
window.colorChanged = colorChanged;
window.colorPickerBlur = colorPickerBlur;
window.displaySelectedContacts = displaySelectedContacts;
window.clearTask = clearTask;

/**
 * Initializes application logic after the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", async function() {
    await loadData();
    setMinDateToday();
    changeIconsSubtask();
    addCreateTaskEventListener();
    addAssignedEventListener();
    addCategoryEventListener()
});

/**
 * Sets the minimum selectable date of the date input field to today's date.
 */
export function setMinDateToday() {
    let dateInput = document.getElementById("input-date");
    if (dateInput) {
        let today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
}

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
            showErrorMessage(field, "This field is required");
        } else {
            field.classList.remove("error-border");
        }
    });
    return isValid
}

/**
 * Displays an error message below a specified input field.
 * @param {*} field The input field where the error occurred.
 * @param {*} message  The error message to display.
 */
function showErrorMessage(field, message) {
    let error = document.createElement("p");
    error.className = "error-message";
    error.innerText = message;
    field.parentNode.appendChild(error);
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
    let maxVisible = 5;
    let selectedArray = Array.from(selectedUsers); // Set to Array
    let totalUsers = selectedArray.length;
    for (let i = 0; i < Math.min(totalUsers, maxVisible); i++) {
        let userId = selectedArray[i];
        let contact = getLoggedInUser().contacts[userId];
        if (!contact || !contact.badge) continue;
        selectedContainer.innerHTML += `<div class="badges" style="background-color:${contact.badge.color}">${contact.badge.initials}</div>`;
    }
    if (totalUsers > maxVisible) {
        let amount = totalUsers - maxVisible;
        selectedContainer.innerHTML += `<div class="badges more-badge">+${amount}</div>`;
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
                } else {
                    window.location.href = 'board.html'
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
    let task = newTask(user, nextTaskID);
    await saveData(`users/${user.id}/tasks/${task.id}`, task);
    clearTask();
    createTaskFeedback();
}

/**
 * 
 * @param {object} user The user object with all informations.
 * @param {number} nextTaskID  The ID to assign to the new task.
 * @returns 
 */
function newTask(user, nextTaskID) {
    return {
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
    animateFeedback(feedback); 
}

/**
 * Animates a feedback message with a slide-in and slide-out effect.
 * @param {HTMLElement} feedback The feedback element to animate.
 */
function animateFeedback(feedback) {
    feedback.classList.remove('move-in', 'move-out');
    feedback.classList.add('move-in');
    setTimeout(() => {
        feedback.classList.replace('move-in', 'move-out');
    }, 1000);
    setTimeout(() => {
        let overlay = feedback.closest('.overlay-create-feedback');
        if (overlay) {
            overlay.remove();
        }
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
        let subtask = createSubtask(subtaskID);
        subtasks.push(subtask);    
    }
    if (subtasks.length === 0) {
        subtasks = ""
    }
    return subtasks;
}

/**
 * Creates a subtask object from the given subtask ID.
 * @param {number} subtaskID The index of the subtask.
 * @returns 
 */
function createSubtask(subtaskID) {
    let subDescription = document.getElementById(`subtaskContent(${subtaskID})`).innerText;
    let subStatus = "open";
    return {
        description: subDescription,
        status: subStatus
    };
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
    } return assignedContacts;
}