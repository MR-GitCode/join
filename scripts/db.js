/**
 * This variable ist set for further need
 * 
 */
let loginEmail = document.querySelector("loginEmail");
let loginPassword = document.querySelector("loginPassword");
let enterID = document.querySelector('#enterID');
let enterName = document.querySelector('#enterName');
let enterEmail = document.querySelector('#enterEmail');
let enterPhone = document.querySelector('#enterPhone');
let enterPassword = document.querySelector('#enterPassword');
let enterConfirmPassword = document.querySelector('#enterConfirmPassword');

let insertBtn = document.querySelector('#insert');
let updateBtn = document.querySelector('#update');
let removeBtn = document.querySelector('#remove');
let findBtn = document.querySelector('#find');

/**
 * This function adds a new data to the firebase database
 * 
 * @param {string} path - the subpath for choosing the right database 'users/' or 'tasks/'
 */
function insertData(path = '') {
    set(ref(database, path + enterID.value), {
        id: enterID,
        name: enterName.value,
        email: enterEmail.value,
        phone: enterPhone,
        password: "mypassword123",
    })
        .then(() => {
            alert('Data added successfully!')
        })
        .catch((error) => {
            alert(error);
        });
};

/**
 * This function adds a new data to the firebase database
 * 
 * @param {string} path - the subpath for choosing the right database 'users/' or 'tasks/'
 */
function findData(path = '') {
    const dbref = ref(database);
    get(child(dbref, path + findID.value))
        .then((snapshot) => {
            if (snapshot.exists()) {
                findName.innerHTML = snapshot.val().name; // noch Anpassen!
                findEmail.innerHTML = snapshot.val().email; // noch Anpassen!

            } else {
                alert('No data found');
            }
        })
        .catch((error) => {
            alert(error)
        });
};

/**
 * This function adds a new data to the firebase database
 * 
 * @param {string} path - the subpath for choosing the right database 'users/' or 'tasks/'
 */
function updateData(path = '') {
    update(ref(database, path + enterID.value), {
        name: enterName.value,
        email: enterEmail.value,
    })
        .then(() => {
            alert('Data updated successfully');
        })
        .catch((error) => {
            alert(error);
        });
};

/**
 * This function adds a new data to the firebase database
 * 
 * @param {string} path - the subpath for choosing the right database 'users/' or 'tasks/'
 */
function removeData(path = 'stop') {
    remove(ref(database, path + enterID.value))
        .then(() => {
            alert('Data removed successfully');
        })
        .catch((error) => {
            alert(error);
        });
};

loginBtn.addEventListener("click", loginEmail, loginPassword);
guestBtn.addEventListener("click", guestBtn);
/* 
insertBtn.addEventListener('click', insertData);
updateBtn.addEventListener('click', updateData);
removeBtn.addEventListener('click', removeData);
findBtn.addEventListener('click', findData);
 */