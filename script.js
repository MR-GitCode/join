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
    let legalsFooter = document.getElementById('footer');
    if (navbar && legalsFooter) {
        if (!user) {   
            navbar.innerHTML = changeNavbar();
            navbar.setAttribute('style', 'justify-content: unset; display: flex;')
        if (window.innerWidth <= 768) {
                legalsFooter.setAttribute('style', 'display: contents !important');
            }
        }
        navbar.style.display = 'flex'; 
    }
}

/**
 * Loads and displays the user's profile badge in the header.
 */
async function loadHeaderBadges() {
    await loadData();
    let user = localStorage.getItem('user')
    if (user) {
        let loggedInUser = getLoggedInUser()
        let userBadgeContainer = document.getElementById('profile-badge');
        if (userBadgeContainer) {
            userBadgeContainer.innerHTML = loadUserBadge(loggedInUser);
            openLogOutMenu(); 
        } 
    }
}

/**
 *  Initializes the menu behavior.
 */
function openLogOutMenu() {
    let profileBadge = document.getElementById('profile-badge')
    let logOutMenu = document.getElementById('log-out-menu');
    profileBadge.addEventListener("click", () => {
        logOutMenu.innerHTML = loadMenu();
        logOutMenu.classList.toggle("active");
        logout();
    });
    closeLogOutMenu(logOutMenu, profileBadge);
}

/**
 * Sets up the logout process.
 */
function logout() {
    let logOut = document.getElementById('log-out');
    if (logOut) {
        logOut.addEventListener("click", () => {
            localStorage.removeItem('user');
        });  
    }
}

/**
 * Closes the logout menu when clicking outside of the menu
 * @param {HTMLElement} logOutMenu The logout menu element to be closed.
 * @param {HTMLElement} profileBadge The profile badge element used to toggle the menu.
 */
function closeLogOutMenu (logOutMenu, profileBadge) {
    document.addEventListener("click" , function (event) {
        if (!logOutMenu.contains(event.target) && !profileBadge.contains(event.target)) {
            logOutMenu.classList.remove("active");
        }
    })
}