import { loadData, getUsers, saveData} from '../db.js';
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
  checkLoginValues() 
  signUp();
});

/**
 * Adds a animation to the logo.
 * Once the logo animation ends, the hidden page content is made visible.
 */
function animateLogo() {
  const logo = document.querySelector('.logo-fly');
  const indexHeader= document.getElementById('index-header');
  const authContainer= document.getElementById('auth-container');
  logo?.addEventListener('animationend', () => {
    indexHeader?.classList.remove('page-content-hidden');
    authContainer?.classList.remove('page-content-hidden');
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
 * Displays a visual alert when login data are incorrect.
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
    input.classList.remove('input-alert')
  });
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
    visiblePasswordLogin();
    userLogin(loginForm); 
    guestLogin(guestBtn);
    checkLoginValues() 
  })
}

/**
 * Form Validation of the login overlay.
 */
function checkLoginValues() {
  let emailInput = document.getElementById('loginEmail');
  let passwordInput = document.getElementById('loginPassword')
  let loginBtn = document.getElementById('loginBtn');
  let validateLogin = () => validateInputs("login", loginBtn, emailInput, passwordInput)
  emailInput.addEventListener('input', validateLogin);
  passwordInput.addEventListener('input', validateLogin);
} 

/**
 * Initializes the registration form functionality.
 */
function registrationSignUp() {
    let nameInput = document.getElementById('signName');
    let emailInput = document.getElementById('signEmail');
    let passwordInput = document.getElementById('signPassword');
    let passwordConfirmInput = document.getElementById('signConfirmPassword');
    let confirmPrivacyPolicy = document.getElementById('confirm-policy');
    let signBtn = document.getElementById('bt-signup');
    let validateLogin = () => validateInputs("sign", signBtn, emailInput, passwordInput, passwordConfirmInput, confirmPrivacyPolicy)
    nameInput.addEventListener('input', validateLogin);
    emailInput.addEventListener('input', validateLogin);
    passwordInput.addEventListener('input', validateLogin);
    passwordConfirmInput.addEventListener('input', validateLogin);
    confirmPrivacyPolicy.addEventListener('change', validateLogin);
    signBtn.addEventListener('click', (event) => {
        event.preventDefault();
        sendSignUP(nameInput, emailInput, passwordInput);
    });
}

/**
 * Handles dynamic input validation based on form type (login or sign-up).
 * @param {string} id Either 'login' or 'sign'.
 * @param {HTMLElement} btn The button to enable/disable.
 * @param {HTMLInputElement} emailInput Email input field
 * @param {HTMLInputElement} passwordInput Password input field.
 * @param {HTMLInputElement} passwordConfirmInput Confirm password input field (sign-up only).
 * @param {HTMLInputElement} confirmPrivacyPolicy  Checkbox input for privacy policy (sign-up only).
 */
function validateInputs(id, btn, emailInput, passwordInput, passwordConfirmInput, confirmPrivacyPolicy) {
  let emailAlert = document.getElementById('email-alert');
  let passwordAlert = document.getElementById('password-regex-alert');
  if (id === 'login') {
    loginValidation(btn, emailAlert, passwordInput, emailInput)
  } if (id === 'sign') {
    signValidation(btn, emailAlert, passwordAlert, passwordInput, emailInput, passwordConfirmInput, confirmPrivacyPolicy)  
  }
}

/**
 * Validates login input fields and toggles button state
 * @param {HTMLElement} btn The button to enable/disable 
 * @param {HTMLElement} emailAlert Alert for email validation.
 * @param {HTMLInputElement} passwordInput Password input field. 
 * @param {HTMLInputElement} emailInput Email input field 
 */
function loginValidation(btn, emailAlert, passwordInput, emailInput) {
  let passwordValid = passwordInput.value.length > 0;
  let emailValid = validateEmail(emailInput.value.trim());
  toggleAlert(emailAlert, emailInput, !emailValid && emailInput.value.trim() !== ''); 
  btn.disabled = !(emailValid && passwordValid);
}

/**
 *  Validates sign-up input fields and toggles button state.
 * @param {HTMLElement} btn The button to enable/disable 
 * @param {HTMLElement} emailAlert Alert for email validation.
 * @param {HTMLElement} passwordAlert Alert for password format.
 * @param {HTMLInputElement} passwordInput Password input field.
 * @param {HTMLInputElement} emailInput Email input field 
 * @param {HTMLInputElement} passwordConfirmInput Confirm password input field.
 * @param {HTMLInputElement} confirmPrivacyPolicy Privacy policy checkbox.
 */
function signValidation(btn, emailAlert, passwordAlert, passwordInput, emailInput, passwordConfirmInput, confirmPrivacyPolicy) {
  let name = document.getElementById('signName').value.trim();
  let email = emailInput.value.trim();
  let password = passwordInput.value.trim();
  let confirmPassword = passwordConfirmInput.value.trim();
  let emailValid = validateEmail(email);
  let passwordValid = validatePassword(password, passwordInput);
  let passwordsMatch = matchOfPasswords(password, confirmPassword);
  toggleAlert(emailAlert, emailInput, !emailValid && email !== '');
  toggleAlert(passwordAlert, passwordInput, !passwordValid && password !== '')
  let allFieldsFilled = name && email && password && confirmPassword; 
  btn.disabled = !(allFieldsFilled && emailValid && passwordValid && passwordsMatch && confirmPrivacyPolicy.checked);
}

/**
 * Shows or hides an alert and toggles the input field's alert styling.
 * @param {HTMLElement} alertElement The alert element to show/hide.
 * @param {HTMLElement} inputField The input element to apply/remove error styling.
 * @param {boolean} show Whether to show the alert.
 */
function toggleAlert(alertElement, inputField, show) {
    alertElement.classList.toggle('hide-alert', !show);
    inputField.classList.toggle('input-alert', show);
}

/**
 * Validates if a password is in a valid format.
 * @param {string} password The password string to validate.
 * @returns 
 */
function validatePassword(password) {
  let passwordRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
    if (!password) return true;
    return passwordRule.test(password);
}

/**
 * Validates if an email address is in a valid format.
 * @param {string} email The email string to validate.
 * @returns 
 */
function validateEmail(email) {
    if (!email) return true;
    let emailRule = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRule.test(email);
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

/**
 * Registers a new user and saves their data.
 * @param {HTMLInputElement} nameInput The input field containing the user's name.
 * @param {HTMLInputElement} emailInput The input field containing the user's email.
 * @param {HTMLInputElement} passwordInput The input field containing the user's password.
 */
async function sendSignUP(nameInput, emailInput, passwordInput) {
  let usersAmount = getUsers().length;
  let newUser = {
    badge : getBadges(nameInput.value),
    contacts : "",
    email : emailInput.value,
    name : nameInput.value,
    password : passwordInput.value,
    phone : "",
    tasks : "",
  }
  await saveData(`users/${usersAmount}/`, newUser);
  showSignedSuccessfully();
}

/**
 * Displays a success feedback animation after sign-up.
 */
function showSignedSuccessfully() {
  let overlay = document.querySelector('.overlay-signed-feedback');
  let feedback = document.getElementById('signed-successfull');
  overlay.style.display = 'flex';
  feedback.classList.remove('move-in', 'move-out');
  feedback.classList.add('move-in');
  setTimeout(() => {
    feedback.classList.remove('move-in');
    feedback.classList.add('move-out');
  }, 1000);
  setTimeout(() => {
    overlay.style.display = 'none';
    feedback.classList.remove('move-out');
    window.location.href = './index.html';
  }, 1500);     
}