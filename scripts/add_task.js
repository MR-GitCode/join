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
 * This function open the drop down menu for the category input field.
 * 
 */
function openCategoryMenu() {
    let categories = document.getElementById("categories");
    categories.style.display = categories.style.display === "block" ? "none" : "block";
}

/**
 * This function changes the category in the input field.
 * @param {string} category Is the select category.
 */
function selectCategory(category) {
    document.getElementById('category-input').value = category;
    document.getElementById("categories").style.display = "none";
}