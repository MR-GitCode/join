/**
 * Opens the "Add Task" overlay by removing the 'hidden' class.
 * Triggered when the "Add Task" button is clicked.
 */
function openOverlay() {
    let overlayContainer = document.getElementById("overlay-add-task")
    overlayContainer.classList.remove('hidden');
    document.body.classList.add('no-scroll');
}

/**
 * Closes the "Add Task" overlay by adding the 'hidden' class.
 */
function closeOverlay() {
    let overlayContainer = document.getElementById("overlay-add-task")
    overlayContainer.classList.add('hidden');
    document.body.classList.remove('no-scroll');
}

document.getElementById("overlay-add-task").addEventListener("click", function (event) {
    let overlayContainer = document.querySelector(".content-add-task");
    if (!overlayContainer.contains(event.target)) {
        closeOverlay();
    }
});