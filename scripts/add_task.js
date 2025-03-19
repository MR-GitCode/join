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
 * The function adds an error message to the input fields without any entry.
 */
function checkInputValue() {
    document.querySelectorAll(".error-message").forEach(error => error.remove());
    let requiredFields = document.querySelectorAll("input[required]");
    requiredFields.forEach(field => {
        if (field.value === "") {
            let error = document.createElement("p");
            error.classList.add("error-message");
            error.innerText = "This field is required";
            field.parentNode.appendChild(error);
        }
    });
}