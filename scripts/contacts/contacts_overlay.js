import { getLoggedInUser, deleteData, saveData} from '../db.js';
import { addContactList, addEventListenerDeleteContact } from '../contacts/contacts.js'

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
    let infoContainer = document.getElementById('contact-data');
    if (!infoContainer === "") {
        infoContainer.innerHTML = "";
    }
    addContactList();
}

/**
 * Create a new contact.
 */
function createContact() {
    let user = getLoggedInUser();
    document.getElementById('bt-create-contact').addEventListener("click", async () => {
         let contact = {
            name : document.querySelector('#name-input input').value,
            email : document.querySelector('#email-input input').value,
            phone : document.querySelector('#phone-input input').value,
            id : getNextFreeId(),
            badge : getBadges(document.querySelector('#name-input input').value),
        };
        await saveData(`users/${user.id}/contacts/${contact.id}/`, contact);
        closeOverlay();
        showCreateContact(contact);
    })    
}

/**
 * Show the informations of the contact.
 * @param {object} contact Object with all informations about the contact. 
 */
function showCreateContact(contact) {
    let contactInList = document.getElementById(`contact-${contact.id}`);
    document.querySelectorAll('.contacts').forEach(c => c.classList.remove("contact-active"));
    contactInList.classList.add("contact-active");
    let infoContainer = document.getElementById('contact-data');
    infoContainer.innerHTML = loadContactInformations(contact);
    addEventListenerDeleteContact(contact.id, infoContainer);
    addEventListenerEditContact(contact);
    contactInList.scrollIntoView({ behavior: "smooth", block: "start" });
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

/**
 * Selects a badge color for a new contact that is not already used by the logged-in user's existing contacts.
 * @returns Returns the color for the badge.
 */
function chooseColor() {
    let contacts = getLoggedInUser().contacts;
    let colors = [];
    for (let i = 0; i < contacts.length; i++) {
        let badgeColor = contacts[i].badge.color;
        colors.push(badgeColor);
    }
    let availableColor = badgeColors.find(color => !colors.includes(color));
    if (!availableColor) {
        let index = contacts.length % badgeColors.length;
        availableColor = badgeColors[index];
    }
    return availableColor;
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
        addEventListenerEditDeleteContact(contact.id);
        saveEdit(contact);
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

/**
 * Deletes the contact.
 * @param {number} contactID this is the id of the contact. 
 */
function addEventListenerEditDeleteContact(contactID) {
    let user = getLoggedInUser();
    document.getElementById('bt-cancel').addEventListener("click", async () => {
        await deleteData(`users/${user.id}/contacts/`, contactID); 
        closeOverlay();      
        })
    }


function saveEdit(contact) {
    let user = getLoggedInUser();
    document.getElementById('bt-create-contact').addEventListener("click", async () => {
        let contactEdit = {
            name : document.querySelector('#name-input input').value,
            email : document.querySelector('#email-input input').value,
            phone : document.querySelector('#phone-input input').value,
            id : contact.id,
            badge : contact.badge,
        }
        await saveData(`users/${user.id}/contacts/${contactEdit.id}/`, contactEdit);       
        closeOverlay();
    })
    
}