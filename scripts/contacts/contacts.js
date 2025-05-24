import {loadData, getLoggedInUser } from '../db.js';

/**
 * Load data and initialize contact list once the DOM is fully loaded
 */
document.addEventListener("DOMContentLoaded", async () => {
    await loadData();
    addContactList();
});

/**
 * Loads the contact list of the currently logged-in user.
 */
function addContactList() {
    let contactList = [];
    let contacts = getLoggedInUser().contacts;
    console.log(contacts);
    if (contacts) {
       for (let i = 0; i < contacts.length; i++) {
        contactList.push(contacts[i].name)
        } 
    }
    contactList.sort();
    addLettersToList(contactList);
    addContacts(contacts);
}

/**
 * Adds alphabetic headers to the contact list section.
 * @param {Array} contactList Array of all names of the contacts.
 */
function addLettersToList(contactList) {
    let contactListContainer = document.getElementById('contact-list');
    let firstLetters = contactList.map(name => name[0].toLowerCase());
    let lettersForAlphabet = [...new Set(firstLetters)];
    for (let i = 0; i < lettersForAlphabet.length; i++) {
        let letter = lettersForAlphabet[i];
        contactListContainer.innerHTML += loadAlphabet(letter);
    }
    console.log(contactList, firstLetters, lettersForAlphabet);  
}

/**
 * 
 * @param {object} contacts This is the object of all contacts 
 */
function addContacts(contacts) {
    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i].name;
        let firstLetterOfContact = contact[0].toLowerCase();
        let containerOfLetter = document.getElementById(`letter-${firstLetterOfContact}`); 
        containerOfLetter.innerHTML += loadRefOfContact(contacts[i]);
        console.log(contact, firstLetterOfContact);
    }
}