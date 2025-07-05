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
 * Checked the input values of the form.
 */
function checkContactValues() {
    const nameInput = document.querySelector('#name-input input');
    const emailInput = document.querySelector('#email-input input');
    const phoneInput = document.querySelector('#phone-input input');
    const createBt = document.getElementById('bt-create-contact');
    function validateInputs() {
        const nameValid = nameInput.value.trim().length > 0;
        const emailIsValid = !emailInput.value.trim() || emailInput.checkValidity();
        const phoneIsValid = !phoneInput.value.trim() || (phoneInput.checkValidity() && amountDigits(phoneInput.value));
        createBt.disabled = !(nameValid && emailIsValid && phoneIsValid);
    }
    nameInput.addEventListener('input', validateInputs);
    emailInput.addEventListener('input', validateInputs);
    phoneInput.addEventListener('input', validateInputs);
    showValidation(emailInput);
    showValidation(phoneInput);
    validateInputs();
    createContact(createBt, nameInput, emailInput, phoneInput)
}

/**
 * Adds validation to input elements.
 * @param {HTMLInputElement} input The input element to validate.
 */
function showValidation(input) {
    input.addEventListener('input', () => {
        if (input.value) {
            if (input.type === 'tel') {
                let digitsValidity = amountDigits(input.value);
                if (!input.checkValidity() && !digitsValidity) {
                    input.setCustomValidity(
                        'Bitte geben Sie eine Telefonnummer ein (2-20 Zeichen/Ziffern, +, Leerzeichen)'
                    );
                } else {
                    input.setCustomValidity('');
                }
                input.reportValidity();
            } else if (input.type === 'email') {
                input.setCustomValidity('');
                input.reportValidity();
            }
        } else {
            input.setCustomValidity('');
            input.reportValidity();
        }
    });
    input.addEventListener('blur', () => {
        if (input.value) input.reportValidity();
    });
}

/**
 * Checks if the input string contains at least two digits.
 * @param {string} inputValue The string to check.
 * @returns {boolean} True if the string contains 2 or more digits, otherwise false.
 */
function amountDigits(inputValue) {
    return (inputValue.match(/\d/g) || []).length >= 2;
}

/**
 * Create a new contact.
 */
function createContact(createBt, nameInput, emailInput, phoneInput) {
    let user = getLoggedInUser();   
    createBt.addEventListener("click", async () => {
        if (createBt.disabled) return;
        let contact = {
            name: nameInput.value,
            email: emailInput.value,
            phone: phoneInput.value,
            id: getNextFreeId(),
            badge: getBadges(nameInput.value),
        };
        await saveData(`users/${user.id}/contacts/${contact.id}/`, contact);
        closeOverlay();
        showCreateContact(contact);
    });
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
    console.log(feedbackTyp);
        feedback.innerText = "Contact succesfully created";
    } else {
        feedback.innerText = "Contact successfully edited.";
    }
    feedback.classList.remove("show", "hide");
    feedback.classList.add("show");
    setTimeout(() => {
        feedback.classList.add("show");
        setTimeout(() => {
            feedback.classList.remove("show");
            feedback.classList.add("hide");
        }, 2500);
    }, 50);
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
 * Saves the edited contact information for the user.
 */
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
        renderContactInformations(contactEdit); 
        await saveData(`users/${user.id}/contacts/${contactEdit.id}/`, contactEdit);
        closeOverlay();
        showCreateContactFeedback("edit");
    })  
}