import { loadData, getUsers} from '../db.js';
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

/**
 * Handles user login form submission.
 * @param {HTMLFormElement} loginForm The login form element.
 */
function userLogin(loginForm) {
  if (loginForm) {
    removeIncorrectLoginAlert();
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
        localStorage.setItem('user', JSON.stringify({id: foundUser.id}));
        window.location.href = './summary.html';
      } else {
        incorrectLoginAlert()
      }
    });
  }
}

/**
 * Displays a visual alert when login data  are incorrect.
 */
function incorrectLoginAlert() {
  let inputs = document.getElementById('loginForm').querySelectorAll('input');
  let loginAlert = document.getElementById('password-alert');
  inputs.forEach( input => {
    input.classList.add("input-alert")})
  loginAlert.classList.remove("hide-alert");
}

/**
 * Sets up input listeners to remove incorrect login alerts on user interaction.
 * Once the user starts typing again, visual warnings are cleared.
 */
function removeIncorrectLoginAlert() {
  let inputs = document.getElementById('loginForm').querySelectorAll('input');
  let loginAlert = document.getElementById('password-alert');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      removeAlerts(inputs, loginAlert);
    });
  });
};

/**
 * Clears all input field warning styles and hides the login alert message.
 * @param {NodeListOf<HTMLInputElement>} inputs  A list of input fields to clear warnings from.
 * @param {HTMLElement} loginAlert The element displaying the login error message.
 */
function removeAlerts(inputs, loginAlert) {
  inputs.forEach(input => {
    input.classList.remove('input-alert')});
  loginAlert.classList.add('hide-alert');
}

/**
 * Handles guest login via button click.
 * @param {HTMLElement} guestBtn The button element for guest login.
 */
function guestLogin(guestBtn) {
  if (guestBtn) {
    guestBtn.addEventListener('click', async () => {
      await loadData();
      const users = getUsers();
      const guestUser = users.find((user) => user.id === 0);

      if (guestUser) {
        localStorage.setItem('user', JSON.stringify({id: guestUser.id}));
        window.location.href = './summary.html';
      } else {
        alert('Guest user not found!');
      }
    });
  }
}

/**
 * Initializes the sign-up view.
 */
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

/**
 * Initializes the login view from
 * @param {HTMLElement} authContainer The container element to render login content.
 */
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

/**
 * Initializes the sign-up form behavior.
 */
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

/**
 * Validates the input fields in the sign-up form.
 */
function validateInputs() {
  let name = document.getElementById('signName').value.trim();
  let email = document.getElementById('signEmail').value.trim();
  let password = document.getElementById('signPassword').value;
  let confirmPassword = document.getElementById('signConfirmPassword').value;
  let checkboxChecked = document.getElementById('confirm-policy').checked;
  let signUpBt = document.getElementById('bt-signup');
  let allFieldsFilled = name && email && password && confirmPassword;
  let passwordsMatch = matchOfPasswords(password, confirmPassword);
  if (signUpBt) {
    signUpBt.disabled = !(allFieldsFilled && passwordsMatch && checkboxChecked);
  }
}

/**
 * Compares the password and confirm password fields for a match.
 * @param {string} password The entered password.
 * @param {string} confirmPassword The entered confirmation password.
 * @returns Returns true if passwords match and are not empty, false otherwise.
 */
function matchOfPasswords(password, confirmPassword) {
  let confirmPasswordInput = document.getElementById('signConfirmPassword');
  let passwordAlert = document.getElementById('password-alert');
  if (password && confirmPassword) {
    if (password === confirmPassword) {
      confirmPasswordInput.classList.remove('input-alert');
      passwordAlert.classList.add("hide-alert");
      return true;
    } else {
      confirmPasswordInput.classList.add('input-alert');
      passwordAlert.classList.remove("hide-alert");
      return false;
    }
  } else {
    confirmPasswordInput.classList.remove('input-alert');
    passwordAlert.classList.add("hide-alert");
    return false;
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

