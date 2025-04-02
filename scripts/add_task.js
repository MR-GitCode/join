import {database, ref, get} from "./db_alt.js";

let subtaskTemplateLoaded = false;
let subtaskID = 0;
let selectedUsers = new Set(); //Set doesn't allow same elements.
console.log(selectedUsers);


window.selectPiority = selectPiority;
window.resetPriority = resetPriority;
window.openAssignedMenu = openAssignedMenu;
window.openCategoryMenu = openCategoryMenu;
window.selectCategory = selectCategory;
window.createTask = createTask;
window.clearSubtaskInput = clearSubtaskInput;
window.addSubtask = addSubtask;
window.deleteSubtaskInput = deleteSubtaskInput;
window.editSubtask = editSubtask;
window.displaySelectedContacts = displaySelectedContacts;
window.clearTask =clearTask

document.addEventListener("DOMContentLoaded", function() {
    changeIconsSubtask();
});

/**
 * This function is used to change the backgroundcolor of the piority buttons.
 * @param {string} piority
 */
function selectPiority(piority) {
    resetPriority()
    document.getElementById(`bt-${piority}`).classList.add(`bt-${piority}`);
    document.getElementById(`svg-${piority}`).src = `./assets/icons/add_task/Prio_${piority}_white.svg`
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
function selectCategory(category) {
    document.getElementById('category-input').value = category;
    document.getElementById("categories").classList.remove("show");
    document.getElementById("arrow-drop-down").src = "./assets/icons/add_task/arrow_drop_down_down.svg";
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
    getContactsDatabank()
}

/**
 * This function adds an error message to the input fields without any entry.
 */
function checkInputValue() {
    document.querySelectorAll(".error-message").forEach(error => error.remove());
    let requiredFields = document.querySelectorAll("input[required]");
    requiredFields.forEach(field => {
        if (field.value === "") {
            field.classList.add("error-border");
            let error = document.createElement("p");
            error.classList.add("error-message");
            error.innerText = "This field is required";
            field.parentNode.appendChild(error);
        }
        else {
            field.classList.remove("error-border");
        }
    });
}

/**
 * This function change the icon plus to close ande done.
 */
function changeIconsSubtask() {
    document.getElementById('subtask-input').addEventListener("input", function () {
        const subtaskIcons = document.getElementById('subtask-icons'); 
        if (this.value !== "" && !subtaskTemplateLoaded) {
                subtaskIcons.innerHTML = loadSubtaskIcons();
                subtaskTemplateLoaded = true;
        } else if (this.value === "") {
            subtaskIcons.innerHTML = loadSubtaskIconsDefault();
            subtaskTemplateLoaded = false;          
        }
    })
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
    let subtaskContent = subtaskInput.value; 
    let ulContainer = document.getElementById('list-subtasks');
    ulContainer.innerHTML += loadAddSubtask(subtaskID, subtaskContent);
    subtaskInput.value = "";
    subtaskID++;    
}

/**
 * This function delete subtask.
 * @param {number} subtaskID This is the ID of the subtask.
 */
function deleteSubtaskInput(subtaskID) {
    let subtask = document.getElementById(`subtask(${subtaskID})`);
    subtask.remove()
}

/**
 * This function edit the subtask and changed the icons.
 * @param {number} subtaskID This is the ID of the subtask.
 */
function editSubtask(subtaskID) {
    let subtask = document.getElementById(`subtask(${subtaskID})`);
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

/**
 * This function load the menu under the "assigned to" input field.
 * @param {object} data This is a object of the firebase database. 
 */
async function getContactsDatabank(data = database) {
    let assignedMenu = document.getElementById('menu-drop-down');
    assignedMenu.innerHTML = "";
    let contactsRef = ref(data,'join/users');
    let userData = await get(contactsRef);
    let usersList = Object.values(userData.val());        
    for (let userIndex = 0; userIndex < usersList.length; userIndex++) {
        let user = usersList[userIndex];       
        let badge = user.badge;
        let name = user.name;
        assignedMenu.innerHTML += loadAssignedMenu(badge, name, userIndex);
    }
    checkSelectedUsers()
    selectContact()
}

/**
 * This function sets an event listener on all selected contacts in the dropdown menu.
 */
function selectContact() {
    document.querySelectorAll(".menu-option").forEach((option, userIndex) => {
        option.addEventListener("click", function () {
            toggleUserSelection(userIndex);
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
function toggleUserSelection(userIndex) {
    let userContainer = document.getElementById(`user(${userIndex})`);
    let optionOfMenu = document.querySelectorAll(".menu-option")[userIndex];
    if (selectedUsers.has(userIndex)) {
        selectedUsers.delete(userIndex);
        optionOfMenu.classList.remove('bg-menu-option');
        userContainer.src = "./assets/icons/add_task/default.svg";
    } else {
        selectedUsers.add(userIndex);
        optionOfMenu.classList.add('bg-menu-option');
        userContainer.src = "./assets/icons/add_task/checked_white.svg";
    }
    displaySelectedContacts()
    checkSelectedUsers()
}

/**
 * This function show the bages of the select contacts above the assign input field.
 */
async function displaySelectedContacts() {
    let selectedContainer = document.getElementById("selected-contacts");
    selectedContainer.innerHTML = "";
    for (let selectedUsersId of selectedUsers) {
        selectedContainer.innerHTML += `<img src=./assets/icons/profilebadge/${selectedUsersId}.svg </img>`
    }
}

/**
 * Checked if the user already exist in 'selectedUsers' Set.
 * If the user is in the set. it updates the background and image
 */
function checkSelectedUsers() {
        for (let selectedUsersId of selectedUsers) {
            let userContainer = document.getElementById(`user(${selectedUsersId})`);
            let optionOfMenu = document.querySelectorAll(".menu-option")[selectedUsersId];
            optionOfMenu.classList.add('bg-menu-option');
            userContainer.src = "./assets/icons/add_task/checked_white.svg";
    }
}

/**
 * Event listener to close the dropdown menu of "assigned to".
 */
document.addEventListener("click", function(event) {
    let menuContacts = document.getElementById('contacts');
    let inputField = document.getElementById('input-assign'); 
    if (!menuContacts.contains(event.target) && event.target !== inputField) {
        menuContacts.classList.remove('show');
    }
})

/**
 * Event listener to close the dropdown menu of "category".
 */
document.addEventListener("click", function(event) {
    let menuCategory = document.getElementById('categories');
    let inputField = document.getElementById("category-input"); 
    if (!menuCategory.contains(event.target) && event.target !== inputField) {
        menuCategory.classList.remove('show');
    }
})

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
        errorMessage.remove();
    }
});

function clearTask() {
    document.querySelector("form").reset();
    selectedUsers.clear();
    displaySelectedContacts();
    resetPriority() 
}

//add push to firebase
function createTask() {
    checkInputValue();
}