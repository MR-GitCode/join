import { getLoggedInUser, getUsers, deleteData, saveData} from '../db.js';
import { addContactList, addEventListenerDeleteContact, renderContactInformations} from '../contacts/contacts.js'

let badgeColors = [
    "#FF7A00" , "#9327FF" , "#FF745E", "#FFC701" , "#FFE62B" ,
    "#FF5EB3" , "#00BEE8" , "#FFA35E", "#0038FF" , "#FF4646" ,
    "#6E52FF" , "#1FD7C1" , "#FC71FF", "#C3FF2B" , "#FFBB2B" 
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
       checkContactValues();
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
 * Initializes contact input validation and sets up real-time validation listeners.
 */
function checkContactValues() {
    let nameInput = document.querySelector('#name-field');
    let emailInput = document.querySelector('#email-field');
    let phoneInput = document.querySelector('#phone-field');
    let createBt = document.getElementById('bt-create-contact');
    let validateContact = () => validateInputs(nameInput, emailInput, phoneInput, createBt)
    nameInput.addEventListener('input', validateContact);
    emailInput.addEventListener('input', validateContact);
    phoneInput.addEventListener('input', validateContact);
    validateContact();
    saveContact(createBt, nameInput, emailInput, phoneInput);
}

/**
 * Validates the contact input fields and updates button state.
 * @param {HTMLInputElement} nameInput Input for the contact's name.
 * @param {HTMLInputElement} emailInput Input for the contact's email.
 * @param {HTMLInputElement} phoneInput Input for the contact's phone number.
 * @param {HTMLInputElement} createBt The button to enable or disable based on validation.
 */
function validateInputs(nameInput, emailInput, phoneInput, createBt) {
    let emailAlert = document.getElementById('email-alert');
    let phoneAlert = document.getElementById('phone-alert');
    let nameValid = nameInput.value.trim().length > 0;
    let emailValid = validateEmail(emailInput.value.trim());
    let phoneValid = validatePhone(phoneInput.value.trim());
    toggleAlert(emailAlert, emailInput, !emailValid && emailInput.value.trim() !== '');
    toggleAlert(phoneAlert, phoneInput, !phoneValid && phoneInput.value.trim() !== '');
    createBt.disabled = !(nameValid && emailValid && phoneValid);
}

/**
 * Shows or hides an alert and toggles the input field's alert styling.
 * @param {HTMLElement} alertElement The alert element to show/hide.
 * @param {HTMLElement} inputField The input element to apply/remove error styling.
 * @param {boolean} show Whether to show the alert.
 */
function toggleAlert(alertElement, inputField, show) {
    alertElement.classList.toggle('hide-alert', !show);
    inputField.classList.toggle('input-alert', show);
}

/**
 * Validates if an email address is in a valid format.
 * @param {string} email The email string to validate.
 * @returns 
 */
function validateEmail(email) {
    if (!email) return true;
    let emailRule = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRule.test(email);
}

/**
 * Validates a phone number for format and digit count.
 * @param {string} phone The phone number string to validate.
 * @returns 
 */
function validatePhone(phone) {
    if (!phone) return true;
    let phoneRule = /^\+?[0-9\s\-]{2,20}$/;
    let digitsValidity = amountDigits(phone);
    return phoneRule.test(phone) && digitsValidity;
}

/**
 * Counts the number of digits in a string.
 * @param {string} inputValue The phonenumber to evaluate
 * @returns 
 */
function amountDigits(inputValue) {
    return (inputValue.match(/\d/g) || []).length >= 2;
}

/**
 * Adds a click event listener to the create button to save a new contact.
 * @param {HTMLElement} createBt The button element to trigger contact creation.
 * @param {HTMLInputElement} nameInput Input element for the contact's name.
 * @param {HTMLInputElement} emailInput Input element for the contact's email.
 * @param {HTMLInputElement} phoneInput Input element for the contact's phone number.
 */
function saveContact(createBt, nameInput, emailInput, phoneInput) {
    let user = getLoggedInUser();   
    createBt.addEventListener("click", async () => {
        if (createBt.disabled) return;
        let contact = newContact(nameInput, emailInput, phoneInput);
        await saveData(`users/${user.id}/contacts/${contact.id}/`, contact);
        closeOverlay();
        showCreateContact(contact);
    });
}
/**
 * Creates a new contact object with values from the input fields.
 * @param {HTMLInputElement} nameInput Input element for the contact's name.
 * @param {HTMLInputElement} emailInput Input element for the contact's email.
 * @param {HTMLInputElement} phoneInput Input element for the contact's phone number.
 * @returns 
 */
function newContact(nameInput, emailInput, phoneInput) {
    return {
        name: nameInput.value,
        email: emailInput.value,
        phone: phoneInput.value,
        id: getNextFreeId(),
        badge: getBadges(nameInput.value),
    }
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
    showCreateContactFeedback("create");
}

/**
 * Show a box with a create feedback.
 */
function showCreateContactFeedback(feedbackTyp) {
    let feedback = document.getElementById("contact-feedback");
    if (feedbackTyp === "create") {
        feedback.innerText = "Contact succesfully created";
    } else {
        feedback.innerText = "Contact successfully edited.";
    }
    feedback.classList.remove("show", "hide");
    feedback.classList.add("show");
    setTimeout(() => {
        feedback.classList.remove("show");
        feedback.classList.add("hide");
    }, 2500);
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
export function getBadges(name) {
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
    let user = localStorage.getItem('user')
    if (user) {
       return colorOfContact()
    } else {
       return colorOfUser()
    }
}

/**
 * Determines an available badge color for a new contact of the currently logged-in user.
 * @returns A string representing the selected badge color.
 */
function colorOfContact() {
    let contacts = getLoggedInUser().contacts;
    let colors = [];
    for (let i = 0; i < contacts.length; i++) {
        let badgeColor = contacts[i]?.badge.color;
        if (badgeColor) {
            colors.push(badgeColor);
        }
    }
    let availableColor = badgeColors.find(color => !colors.includes(color));
    if (!availableColor) {
        let index = contacts.length % badgeColors.length;
        availableColor = badgeColors[index];
    } return availableColor;
}

/**
 * Determines an available badge color for a new user.
 * @returns A string representing the selected badge color.
 */
function colorOfUser() {
    let users = getUsers()
    let colors = [];
    for (let i = 0; i < users.length; i++) {
        let badgeColor = users[i]?.badge.color;
        if (badgeColor) {
            colors.push(badgeColor);
        }
    }
    let availableColor = badgeColors.find(color => !colors.includes(color));
    if (!availableColor) {
        let index = users.length % badgeColors.length;
        availableColor = badgeColors[index];
    } return availableColor; 
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
        checkContactValues();
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
        let infoContainer = document.getElementById('contact-data');
        infoContainer.innerHTML = "";
        closeOverlay();
        document.getElementById('contact-list').scrollIntoView({ behavior: "smooth", block: "start" });
    }) 
}

/**
 * Adds a click event listener to the save button for editing a contact.
 * @param {object} contact The original contact object to be edited.
 */
function saveEdit(contact) {
    let user = getLoggedInUser();
    let saveBt = document.getElementById('bt-create-contact');
    saveBt.addEventListener("click", async () => {
        if (saveBt.disabled) return;
        let contactEdit = editContact(contact);
        renderContactInformations(contactEdit); 
        await saveData(`users/${user.id}/contacts/${contactEdit.id}/`, contactEdit);
        closeOverlay();
        showCreateContactFeedback("edit");
    })  
}

/**
 * Return the updated contact.
 * @param {object} contact The original contact object to be edited.
 * @returns 
 */
function editContact(contact) {
    return {
        name : document.querySelector('#name-input input').value,
        email : document.querySelector('#email-input input').value,
        phone : document.querySelector('#phone-input input').value,
        id : contact.id,
        badge : contact.badge, 
    }
}