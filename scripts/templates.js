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
 * Returns the navbar if a user doesn't login.
 * @returns 
 */
function changeNavbar() {
    return `<a href="./index.html">
                <img src="./assets/icons/log_in.svg">
                <p>Log In</p>
            </a>`
}
