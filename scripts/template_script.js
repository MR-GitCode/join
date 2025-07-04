/**
 * Returns the user's badge in the header.
 * @param {Object} user The user object containing badge data.
 * @returns 
 */
function loadUserBadge(user) {
    return `<div class="badges-header">${user.badge.initials}</div>`
}

/**
 * 
 * @returns Returns the HTML markup for the dropdown logout menu.
 */
function loadMenu() {
    return `<a id="help" href="./help.html">Help</a>
            <a href="./legal-notice.html">Legal Notice</a>
            <a href="./privacy-policy.html">Privacy Policy</a>
            <a id="log-out" href="./index.html">Log out</a>`
}