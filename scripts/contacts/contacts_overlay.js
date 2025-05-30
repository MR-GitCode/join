import { getLoggedInUser, saveData} from '../db.js';

let badgeColors = [
    "#9326ff" , "#ff7b00" , "#6e52ff" , "#fd70ff" , "#ffbc2b",
    "#1ed6c1" , "#462f8a" , "#ff4545" , "#FF5733", "#33B5FF",
    "#8E44AD", "#2ECC71", "#F1C40F", "#E67E22", "#1ABC9C",
    "#C0392B", "#3498DB", "#9B59B6"
];

/**
 * Add a event listener to the "add new contact" button and load the template
 */
export function addEventListenerToNewContact() {
    let btAddContact = document.getElementById('bt-add-contact');
    btAddContact.addEventListener("click", () => {
       let overlayContact = document.getElementById('overlay-contact');
       overlayContact.classList.remove('hidden');
       let overlayContainer = document.getElementById('overlay-container');
       overlayContainer.innerHTML = loadOverlayAddContact();
       addEventListenerCloseOverlay(overlayContact);
       createContact();
    })
}

/**
 * Adds an event listener to the contact overlay that closes the overlay
 * @param {HTMLElement} overlayContact The HTML element representing the contact overlay.
 */
function addEventListenerCloseOverlay(overlayContact) {
    overlayContact.addEventListener("click", function (event) {
    let closeButton = document.getElementById('close-overlay-contact')
    let overlayContainer = document.getElementById('overlay-container')
    let btCancel = document.getElementById('bt-cancel')
        if (closeButton.contains(event.target) || btCancel.contains(event.target) || (!overlayContainer.contains(event.target))) {
            closeOverlay()
        }
    });
}

/**
 * Close the overlay on the contact side.
 */
function closeOverlay() {
    let overlayContact = document.getElementById('overlay-contact');
    overlayContact.classList.add('hidden');
    overlayContainer.innerHTML = "";
}

/**
 * Create a new contact.
 */
function createContact() {
    document.getElementById('bt-create-contact').addEventListener("click", () => {
         let contact = {
            name : document.querySelector('#name-input input').value,
            email : document.querySelector('#email-input input').value,
            phone : document.querySelector('#phone-input input').value,
            id : getNextFreeId(),
            badges : getBadges(document.querySelector('#name-input input').value),
        };
        // saveData(`users/${id}/contacts/`, contact)
        console.log(`users/${contact.id}/contacts/`, contact);
        closeOverlay()
    })    
}

/**
 * 
 * @returns Returns the free id for the new contact.
 */
function getNextFreeId() {
    let contacts = getLoggedInUser().contacts;
    if (!contacts) return 0;
    let i = 0;
    while (contacts[i] != null) {
        i++;
    }
    return i;
}

/**
 * 
 * @param {string} name The name of the new contact 
 * @returns Returns the object of the badges.
 */
function getBadges(name) {
    let parts = name.trim().split(" ");
    let firstName = parts[0] || "";
    let lastName = parts[1] || "";
    let badge = {
        initials : (firstName[0]?.toUpperCase()) + (lastName[0]?.toUpperCase() || ""),
        color : chooseColor(),
    }
    return badge
}

function chooseColor() {
    let contacts = getLoggedInUser().contacts;
    console.log(contacts);
    
    let usedColors = contacts.map(c => c.badge?.color).filter(Boolean)
    console.log(usedColors);
    
}

/**
 * Add a event listener to the "edit" button and load the template. 
 * @param {object} contact This is the object of the contact.
 */
export function addEventListenerEditContact(contact) {
    document.getElementById('edit-contact').addEventListener("click", () => {
        let overlayContact = document.getElementById('overlay-contact');
        overlayContact.classList.remove('hidden');
        let overlayContainer = document.getElementById('overlay-container');
        overlayContainer.innerHTML = loadOverlayEditContact(contact);
        editInputValue(contact);
        addEventListenerCloseOverlay(overlayContact); 
    })
}

/**
 * Adds the text for the respective input field of the contact.
 * @param {object} contact This is the object of the contact.
 */
function editInputValue(contact) {   
    document.querySelector('#name-input input').value = contact.name;
    document.querySelector('#email-input input').value = contact.email;
    document.querySelector('#phone-input input').value = contact.phone;
}