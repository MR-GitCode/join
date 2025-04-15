function closeOverlay() {
    let overlayContainer = document.getElementById("overlay-add-task")
    overlayContainer.classList.add('hidden');
}

function openOverlay() {
    let overlayContainer = document.getElementById("overlay-add-task")
    overlayContainer.classList.remove('hidden');
}