let subtaskTemplateLoaded = false;
let subtaskID = 0;

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
}

//add push to firebase
function createTask() {
    checkInputValue();
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

// /**
//  * 
//  * @param {number} subtaskID  This is the ID of the subtask.
//  */
// function sendSubtask(subtaskID) {
//     let subtaskContent = document.getElementById(`subtaskContent(${subtaskID})`); //push to fireBase
// }

document.addEventListener("click", function (event) {
    document.querySelectorAll("#list-subtasks .list-subtask").forEach((li) => {
        if (!li.contains(event.target)) {
            li.classList.remove("edit-subtask", "subtask-icon-flex");
        }
    });
});