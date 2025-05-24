/**
 * 
 * @param {string} letter This it the first letter. 
 * @returns Returns the letter for the alphabetic section.
 */
function loadAlphabet(letter) {
    return `<div>
                <div class="letters">${letter}</div>
                <hr>
                <div id="letter-${letter}"></div>
            </div>`
}

/**
 * 
 * @param {object} contact This is the object of all contacts.
 * @returns Returns the information of the contact.
 */
function loadRefOfContact(contact) {
    return `<div class="contacts" id="contact-${contact.id}">
                <img src="./assets/icons/profilebadge/${contact.id}.svg">
                <div class="contact-names">
                    <p>${contact.name}</p>
                    <a href="">${contact.email}</a>
                </div>
            </div>`
}