/**
 * This function returns the template for the loading spinner.
 * 
 * @param {string} data - The URL for the Image of the loading spinner.
 */
function getLoadingSpinnerTemplate() {
    return `<object data="./assets/icons/logo_black.svg" type="image/svg+xml" class="startpage-logo">
            <!---Fallback--->
            Ihr Browser kann leider kein svg darstellen!
        </object>`;
};

/**
 * Returns the "sign up" template.
 * @returns 
 */
function loadSignUp() {
    return `<div class="signup-container">
                <img id="returnToLogin" src="./assets/icons/login_signUp/arrow-left-line.svg">
                <h1>Sign up</h1>
                <div class="underline"></div>
                <form id="signUpForm">
                    <div class="index-input">
                        <input type="text" placeholder="Name" id="signName" required>
                        <img src="./assets/icons/contacts/person.svg">
                    </div>
                    <div class="index-input">
                        <input type="email" placeholder="Email" id="signEmail" required>
                        <img src="./assets/icons/login_signUp/mail.svg">
                    </div>
                    <div class="index-input">
                        <input type="password" placeholder="Password" id="signPassword" autocomplete="off" required>
                        <img id="lockedIcon1" src="./assets/icons/login_signUp/lock.svg"> 
                    </div>
                    <div class="index-input">
                        <input type="password" placeholder="Confirm Password" id="signConfirmPassword" autocomplete="off" required>
                        <img id="lockedIcon2" src="./assets/icons/login_signUp/lock.svg">
                        <div id="password-alert" class="hide-alert">Your passwords don't match. Please try again.</div> 
                    </div>
                    <div class="checkbox-container">
                        <input id="confirm-policy" type="checkbox">
                        <label>I accept the <a href="./privacy-policy.html">Privacy policy</a></label>
                    </div>
                    <button id="bt-signup" type="submit" class="signup-button" disabled>Sign up</button>
                </form>
            </div>
            <div class="overlay-signed-feedback">
                <div id="signed-successfull">You Signed Up successfully</div>
            </div>`
}

/**
 * Returns the "login" template.
 * @returns 
 */
function loadLogin() {
    return `<div class="log-in-card">
                <div>
                    <div class="login">
                        <h1>Log in</h1>
                        <div class="divider"></div>
                    </div>
                </div>
                <form id="loginForm">
                    <div class="index-input">
                        <input type="email" id="loginEmail" autocomplete="current-password" placeholder="Email" required>
                        <img src="./assets/icons/login_signUp/mail.svg">
                    </div>
                    <div class="index-input">
                        <input type="password" id="loginPassword" autocomplete="current-password" placeholder="Password" required>
                        <img id="lockedIcon" src="./assets/icons/login_signUp/lock.svg">           
                    </div>
                    <div class="login-buttons">
                        <button type="submit" class="buttons" id="loginBtn">Log in</button>
                        <button type="button" class="guest" id="guestBtn">Guest Log in</button>
                    </div>
                </form>
            </div>`
}
