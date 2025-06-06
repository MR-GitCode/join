import {loadData, getLoggedInUser, saveData, deleteData} from '../db.js';
import {addEventListenerToNewContact, addEventListenerEditContact} from '../contacts/contacts_overlay.js'

/**
 * Load data and initialize contact list once the DOM is fully loaded
 */
document.addEventListener("DOMContentLoaded", async () => {
    await loadData();
    addContactList();
    addEventListenerToNewContact();
});

/**
 * Loads the contact list of the currently logged-in user.
 */
export function addContactList() {
    let contactList = [];
    let contacts = getLoggedInUser().contacts;
    if (contacts) {
       for (let i = 0; i < contacts.length; i++) {
        if(contacts[i]){
           contactList.push(contacts[i].name) 
        }
        } 
    }
    contactList.sort()
    addLettersToList(contactList);
    addContacts(contacts);
    addContactEventListener(contacts);
}

/**
 * Adds alphabetic headers to the contact list section.
 * @param {Array} contactList Array of all names of the contacts.
 */
function addLettersToList(contactList) {
    let contactListContainer = document.getElementById('contact-list');
    contactListContainer.innerHTML = "";
    let firstLetters = contactList.map(name => name[0].toLowerCase());  
    let lettersForAlphabet = [...new Set(firstLetters)];
    for (let i = 0; i < lettersForAlphabet.length; i++) {
        let letter = lettersForAlphabet[i];
        contactListContainer.innerHTML += loadAlphabet(letter);
    }
}

/**
 * Inserts each contact into the corresponding alphabetic section.
 * @param {object} contacts This is the object of all contacts.
 */
function addContacts(contacts) {
    for (let i = 0; i < contacts.length; i++) {
        if(contacts[i]){
            let contact = contacts[i].name;
            let firstLetterOfContact = contact[0].toLowerCase();
            let containerOfLetter = document.getElementById(`letter-${firstLetterOfContact}`); 
            containerOfLetter.innerHTML += loadRefOfContact(contacts[i]);
        }
    }
}

/**
 * Add a event listener to the contacts in the contact list an load the informations of the contact.
 * @param {object} contacts This is the object of all contacts.
 */
function addContactEventListener(contacts) {
    document.querySelectorAll('.contacts').forEach((contact) => {
        contact.classList.remove("contacts-active");
        contact.addEventListener("click", (event) => {
            document.querySelectorAll('.contacts').forEach(c => c.classList.remove("contact-active"));
            contact.classList.add("contact-active");
            let contactID = parseInt(event.currentTarget.id.replace('contact-', ''));
            let infoContainer = document.getElementById('contact-data');
            for (let i = 0; i < contacts.length; i++) {  
                if (contacts[i] && contacts[i].id == contactID) {
                    infoContainer.innerHTML = loadContactInformations(contacts[i]);
                    addEventListenerDeleteContact(contactID, infoContainer);
                    addEventListenerEditContact(contacts[i]);
                    if (window.innerWidth <= 425) {
                        document.querySelector('.contact-selections').style.display = 'none';
                        document.querySelector('.right-screen').style.display = 'flex';
                        editingMenuEventListen();
                        backToContactList();
                    }
                    break;
                }
            }
        });
    });
}

/**
 * Open the menu with edit and delete for the contact in small displays
 */
function editingMenuEventListen() {
    let menu = document.querySelector('.bts-select-task');
    let btMenu = document.getElementById('editing-menu');
    btMenu.addEventListener("click", (event) => {
        event.stopPropagation();
        menu.classList.toggle('show');
    });

    document.addEventListener("click", (event) => {
        if (!menu.contains(event.target) && !btMenu.contains(event.target)) {
            menu.classList.remove('show');
        }
    });
}

function backToContactList() {
    document.getElementById('back-arrow').addEventListener("click" , () => {
        document.querySelector('.contact-selections').style.display = 'flex';
        document.querySelector('.right-screen').style.display = 'none';
        addContactList()
    })
};

/**
 * Deletes the contact of the user.
 * @param {number} contactID This is the id of the contact. 
 */
export function addEventListenerDeleteContact(contactID, infoContainer) {
    let user = getLoggedInUser();
    document.getElementById('delete-contact').addEventListener("click", async () => {
        await deleteData(`users/${user.id}/contacts/`, contactID);
        addContactList();
        infoContainer.innerHTML = "";
    })
}