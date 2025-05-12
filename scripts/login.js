import { loadData, getUsers } from "./db.js";

window.fillForm = fillForm;

<<<<<<< HEAD
// Sobald das DOM vollständig geladen ist
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById('loginForm');
    const guestBtn = document.getElementById('guestBtn');

    if (loginForm) {
        loginForm.addEventListener('submit', async function (submit) {
            submit.preventDefault();
            console.log('Login');
            await loadData();
            loginUser();
        });
    }

    if (guestBtn) {
        guestBtn.addEventListener('click', async function () {
            console.log('GuestLogin');
            await loadData();
=======
/**
 * Eventlister for the login buttons.
 */
document.addEventListener("DOMContentLoaded", () => {
    let loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function (submit) {
            submit.preventDefault();
            console.log('Login');
            await loadData();
            loginUser();
        });
    }

    let guestBtn = document.getElementById('guestBtn');
    if (guestBtn) {
        guestBtn.addEventListener('click', function () {
            console.log('GuestLogin');
>>>>>>> 4b6421a135571e417e0f5d2aab59bc00d3dbf504
            loginAsGuest();
        });
    }
});

/**
 * Prüft Login-Daten
 */
async function loginUser() {
    const users = getUsers();
    const email = document.getElementById('loginEmail');
    const password = document.getElementById('loginPassword');

    const user = users.find(u => u.email === email.value && u.password === password.value);

    if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        window.location.href = 'summary.html';
    } else {
        alert("Falsche Login-Daten!");
    }
}

/**
 * Gast-Login: nimmt Dummy-Daten oder ersten User
 */
function loginAsGuest() {
    const guestUser = {
        id: 'guest',
        name: 'Gast',
        email: 'guest@join.de'
    };

    localStorage.setItem('loggedInUser', JSON.stringify(guestUser));
    window.location.href = 'summary.html';
}

/**
 * Füllt das Login-Formular testweise mit Daten
 */
function fillForm() {
    const users = getUsers();
    if (users.length >= 2) {
        document.getElementById("loginEmail").value = users[1].email;
        document.getElementById("loginPassword").value = users[1].password;
    }
}

