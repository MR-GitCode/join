import { loadData, getUsers } from "./db.js";

window.fillForm = fillForm;

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById('loginForm');
    const guestBtn = document.getElementById('guestBtn');

    if (loginForm) {
        loginForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            console.log('Login...');
            await loadData();       // Nutzer laden
            loginUser();            // Versuche regulären Login
        });
    }

    if (guestBtn) {
        guestBtn.addEventListener('click', async function () {
            console.log('Gast-Login...');
            await loadData();       // WICHTIG: Daten müssen geladen sein
            loginAsGuest();
        });
    }
});

/**
 * Führt einen regulären Login durch
 */
function loginUser() {
    const users = getUsersSafe();
    const email = document.getElementById('loginEmail')?.value;
    const password = document.getElementById('loginPassword')?.value;

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        window.location.href = 'summary.html';
    } else {
        alert("Falsche Login-Daten!");
    }
}

/**
 * Führt einen Gast-Login durch
 */
function loginAsGuest() {
    const users = getUsersSafe();

    const guestUser = users.find(u => u.id === 0 || u.name.toLowerCase() === 'gast');

    if (guestUser) {
        localStorage.setItem('loggedInUser', JSON.stringify(guestUser));
        window.location.href = 'summary.html';
    } else {
        alert("Gast-Benutzer konnte nicht gefunden werden!");
        console.error("Verfügbare Benutzer:", users);
    }
}

/**
 * Füllt das Formular testweise mit einem Beispielbenutzer
 */
function fillForm() {
    const users = getUsersSafe();
    if (users.length >= 2) {
        document.getElementById("loginEmail").value = users[1].email;
        document.getElementById("loginPassword").value = users[1].password;
    }
}

/**
 * Liefert Benutzerliste als Array (sicher)
 */
function getUsersSafe() {
    const rawUsers = getUsers();
    if (!rawUsers) return [];
    return Array.isArray(rawUsers) ? rawUsers : Object.values(rawUsers);
}

