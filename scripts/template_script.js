function loadUserBadge(user) {
    return `<div class="badges-header">${user.badge.initials}</div>`
}

function loadMenu() {
    return `<a id="help" href="./help.html">Help</a>
            <a href="./legal-notice.html">Legal Notice</a>
            <a href="./privacy-policy.html">Privacy Policy</a>
            <a id="log-out" href="./index.html">Log out</a>`
}