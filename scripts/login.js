import { database, ref, set, get, update, remove, child, onValue } from "./db.js";

/**
 * This function checks the login data
 * 
 * @param {string} email - The Variable for the Email.
 * @param {string} password - The Variable for the Password.
 */
async function loginUser() {
    let email = document.getElementById('loginEmail');
    let password = document.getElementById('loginPassword');
    user = users.find(u => u.email == email.value && u.password == password.value);
    if (user) {
        user.login = 1;
        await saveData('users', user.id);
        window.location = 'start.html'
    } else {
        location.reload();
    }
};
/**
 * This Function takes the first Data in DB for Guest-Login
 * 
 * @param {string} id - The Variable for the ID. 
 */
async function loginAsGuest(id) {
    users[id].login = 1;
    await saveData('users', users[id]);
    window.location = 'start.html'
};
/**
 * This Function is for testing the side. It fills a user and password in the form
 * 
 * @param {string} user - The Variable for the User.
 */
function fillForm() {
    user = users[1];
    document.getElementById("email").value = users[1].email;
    document.getElementById("password").value = users[1].password;
};


export function getAllDataRealtime() {
    const joinDatabaseUsersRef = ref(database, "join/users");

    onValue(joinDatabaseUsersRef, (snapshot) => {
        snapshot.forEach(childSnapshot => {
            users.push(childSnapshot.val());
        });

    });

    console.table(users);

    };
    