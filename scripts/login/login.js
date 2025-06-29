import { loadData, getUsers, saveData } from '../db.js';
import { getBadges } from '../contacts/contacts_overlay.js';

/**
 * Initializes the login page after the DOM has fully loaded.
 * - Sets up visible password toggle
 * - Handles user login
 * - Handles guest login
 * - Starts logo animation
 */
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const guestBtn = document.getElementById('guestBtn');
  visiblePasswordLogin();
  userLogin(loginForm); 
  guestLogin(guestBtn);
  animateLogo();
  signUp();
});

/**
 * Adds a animation to the logo.
 * Once the logo animation ends, the hidden page content is made visible.
 */
function animateLogo() {
  const logo = document.querySelector('.logo-fly');
  const pageContent = document.getElementById('page-content');
  logo?.addEventListener('animationend', () => {
    pageContent?.classList.remove('page-content-hidden');
  });
}


function userLogin(loginForm) {
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value.trim();
      await loadData();
      const users = getUsers();
      const foundUser = users.find(
        (user) => user.email === email && user.password === password
      );
      if (foundUser) {

        const userData = {};
        users.forEach((user) => {
          const updatedUser = { ...user, login: user.id === foundUser.id ? 1 : 0 };
          userData[user.id] = { ...updatedUser };
          delete userData[user.id].id; 
        });
        await saveData('users', userData);
        const [firstName, lastName = ''] = foundUser.name.split(' ');
        localStorage.setItem('user', JSON.stringify({
            id: foundUser.id,
            firstName,
            lastName,
            badge: foundUser.badge,
        }));
        window.location.href = './summary.html';
      } else {
        alert('Invalid login details!');
      }
    });
  }
}

function guestLogin(guestBtn) {
  if (guestBtn) {
    guestBtn.addEventListener('click', async () => {
      await loadData();
      const users = getUsers();
      console.log(users);
      
      const guestUser = users.find((user) => user.id === 0);
      if (guestUser) {
        const userData = {};
        users.forEach((user) => {
          const updatedUser = { ...user, login: user.id === guestUser.id ? 1 : 0 };
          userData[user.id] = { ...updatedUser };
          delete userData[user.id].id;
        });
        await saveData('users', userData);
        localStorage.setItem( 'user', JSON.stringify({
            id: guestUser.id,
            firstName: 'Gast',
            lastName: '',
            badge: guestUser.badge,
          })
        );
        window.location.href = './summary.html';
      } else {
        alert('Guest user not found!');
      }
    });
  }
}

function signUp() {
  document.getElementById('openSignUpBtn').addEventListener("click", () => {
    let authContainer = document.getElementById('auth-container');
    authContainer.innerHTML = loadSignUp();
    document.getElementById('index-header').classList.add('hidden');
    login(authContainer);
    visiblePasswordSignUp();
    setTimeout(() => {
      registrationSignUp();
    }, 50);
  })
};

function login(authContainer) {
  document.getElementById('returnToLogin').addEventListener("click", () => {
    authContainer.innerHTML = loadLogin();
    document.getElementById('index-header').classList.remove('hidden');
  })
}

/**
 * Enables toggling password visibility for the login form.
 */
function visiblePasswordLogin() {
  passwordVisibility("loginPassword", "lockedIcon");
}

/**
 * Enables toggling password visibility for the sign-up form.
 */
function visiblePasswordSignUp() {
  passwordVisibility("signPassword", "lockedIcon1");
  passwordVisibility("signConfirmPassword", "lockedIcon2");
}

/**
 * Attaches event listeners to an input and icon to toggle password visibility
 * @param {string} inputId The ID of the input element
 * @param {string} iconId The ID of the icon element used to toggle visibility.
 */
function passwordVisibility(inputId, iconId) {
  let input = document.getElementById(inputId);
  let icon = document.getElementById(iconId);
  input.addEventListener('focus', () => {
    icon.src = "./assets/icons/login_signUp/visibility_off.svg"
  })
  input.addEventListener('input', () => {
    icon.src = "./assets/icons/login_signUp/visibility_off.svg"
  })
  icon.addEventListener('click', () => {
    if (input.type === "password") {
      input.type = "text";
      icon.src = "./assets/icons/login_signUp/visibility.svg"
    } else {
      input.type = "password";
      icon.src = "./assets/icons/login_signUp/visibility_off.svg"
  }})
}

function registrationSignUp() {
    let nameInput = document.getElementById('signName');
    let emailInput = document.getElementById('signEmail');
    let passwordInput = document.getElementById('signPassword');
    let passwordConfirmInput = document.getElementById('signConfirmPassword');
    let confirmPrivacyPolicy = document.getElementById('confirm-policy');
    let signUpBt = document.getElementById('bt-signup');
    validateInputs();
    nameInput.addEventListener('input', validateInputs);
    emailInput.addEventListener('input', validateInputs);
    passwordInput.addEventListener('input', validateInputs);
    passwordConfirmInput.addEventListener('input', validateInputs);
    confirmPrivacyPolicy.addEventListener('change', validateInputs);
    signUpBt.addEventListener('click', () => {
      if (!signUpBt.disabled) {
        sendSignUP(nameInput, emailInput, passwordInput);
      }
    });
}

function validateInputs() {
  let name = document.getElementById('signName').value.trim();
  let email = document.getElementById('signEmail').value.trim();
  let password = document.getElementById('signPassword').value;
  let confirmPassword = document.getElementById('signConfirmPassword').value;
  let checkboxChecked = document.getElementById('confirm-policy').checked;
  let signUpBt = document.getElementById('bt-signup');
  let allFieldsFilled = name && email && password && confirmPassword;
  let passwordsMatch = password === confirmPassword;
  if (signUpBt) {
    signUpBt.disabled = !(allFieldsFilled && passwordsMatch && checkboxChecked);
  }
}

function sendSignUP(nameInput, emailInput, passwordInput) {
  let usersAmount = getUsers().length;
  let newUserID = usersAmount+1;
  let newUser = {
    badge : getBadges(nameInput.value),
    contacts : "",
    email : emailInput.value,
    login : 0,
    name : nameInput.value,
    password : passwordInput.value,
    phone : "",
    task : "",
  }

  console.log(newUser);
  console.log(`users/${newUserID}/`, newUser);
  
  // await saveData(`users/${newUserID}/`, newUser);

  // console.log(nameInput, emailInput, passwordInput);
}