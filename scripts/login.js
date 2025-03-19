/**
 * This function checks the login data
 * 
 * @param {string} email - The Variable for the Email.
 * @param {string} password - The Variable for the Password.
 */
function loginUser() {
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    user = users.find(u => u.email == email.value && u.password == password.value);
    if (user) {
        window.location = 'start.html'
    } else {
        location.reload();
    }
};

function loginAsGuest() {
    user
    window.location = 'start.html'
};

function fillForm() {
    user = users[0];
    document.getElementById("email").value = users[0].email;
    document.getElementById("password").value = users[0].password;
};