/**
 * This function checks the login data
 * 
 * @param {string} email - The Variable for the Email.
 * @param {string} password - The Variable for the Password.
 */
async function loginUser() {
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    user = users.find(u => u.email == email.value && u.password == password.value);
    if (user) {
        user.login = 1;
        await saveData('users', user.id);
        window.location = 'start.html'
    } else {
        location.reload();
    }
};

async function loginAsGuest(id) {
    users[id].login = 1;
    await saveData('users', users[id]);
    window.location = 'start.html'
};

function fillForm() {
    user = users[1];
    document.getElementById("email").value = users[1].email;
    document.getElementById("password").value = users[1].password;
};