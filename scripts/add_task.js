/**
 * This function is used to change the backgroundcolor of the piority buttons.
 * @param {string} piority
 */
function selectPiority(piority) {
    document.getElementById('bt-urgent').classList.remove('bt-urgent');
    document.getElementById('bt-medium').classList.remove('bt-medium');
    document.getElementById('bt-low').classList.remove('bt-low');
    document.getElementById(`bt-${piority}`).classList.add(`bt-${piority}`);
} 

/**
 * This function open the drop down menu for the category input field with ease-out.
 * 
 */
function openCategoryMenu() {
    let categories = document.getElementById("categories");
    let droptDownImg = document.getElementById("arrow-drop-down");
    if (categories.classList.contains("show")) {
        categories.classList.remove("show");
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