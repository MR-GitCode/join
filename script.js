import { loadData, getLoggedInUser } from "./scripts/db.js";

window.onload = () => {
    init();
    initLegals();
    loadHeaderBadges();
};

/**
 * This function initializes the page by calling other functions.
 */
function init(version) {
    switch (version) {
        case 0:
            toggleLoadingSpinner();
            loadingSpinner();
            loadData();
            setTimeout(toggleLoadingSpinner(), 3000);
            break;

        default:
            loadData();
            break;
    }
};

/**
 * This function change the visibility to hidden and back to visible.
 * 
 * @param {string} id - The ID of the element that should be toggled.
 * @param {string} d_none - The class with the display none property.
 */
function toggleDNone(id) {
    document.getElementById(id).classList.toggle('d_none')
};

/**
 * This function stops the function from propagating to parent elements.
 * 
 * @param {string} event - The event itself to stop from propagation.
 */
function noBubbling(event) {
    event.stopPropagation()
};

/**
 * This function defines the content reference and sets the inner HTML to an empty string.
 * 
 * @param {string} elementID - The ID of the element that should be referenced.
 */
function setContentRef(elementID) {
    contentRef = document.getElementById(elementID);
    contentRef.innerHTML = '';
};

/**
 * This function toggles the loading spinner on and off.
 * 
 * @param {string} startpage-logo-container - The ID of the element that contains the loading spinner.
 */
function toggleLoadingSpinner() {
    toggleDNone('startpage-logo-container');
    setContentRef('startpage-logo-container');
};

/**
 * This function starts the loading spinner by using a template with another function.
 * 
* @param {Function} getLoadingSpinnerTemplate() - Insert the template for the loading spinner
 */
function loadingSpinner() {
    contentRef.innerHTML += getLoadingSpinnerTemplate();
};

/**
 * Checks if a user is logged in and loads the navbar
 */
async function initLegals() {
    await loadData();
    let user = getLoggedInUser();
    let navbar = document.getElementById('navbar');
    let legalsFooter = document.getElementById('footer')
    if (navbar && legalsFooter) {
        if (!user) {   
            navbar.innerHTML = changeNavbar();
            navbar.setAttribute('style', 'justify-content: unset; padding-left: 5px;')
        if (window.innerWidth <= 425) {
                legalsFooter.setAttribute('style', 'display: flex;'); 
            }
        } 
    }
}

async function loadHeaderBadges() {
    await loadData();
    let user = getLoggedInUser();
    let userBadgeContainer = document.getElementById('profile-badge');
    userBadgeContainer.innerHTML = loadUserBadge(user);
}