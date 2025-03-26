import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getDatabase, set, get, update, remove, ref, child, onValue } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA3Z2wSjOOA6Qcae1-qy6p5tFPLNjLd4bk",
    authDomain: "join-441.firebaseapp.com",
    databaseURL: "https://join-441-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "join-441",
    storageBucket: "join-441.firebasestorage.app",
    messagingSenderId: "830251331110",
    appId: "1:830251331110:web:6463be5c4dc792abb640e7"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
export { database, ref, set, get, update, remove, child, onValue };

/**
 * This variable ist set for further need
 * 
 */
let loginEmail = document.querySelector("loginEmail");
/**
 * This variable ist set for further need
 * 
 */
let loginPassword = document.querySelector("loginPassword");
/**
 * This variable ist set for further need
 * 
 */
let enterID = document.querySelector('#enterID');
/**
 * This variable ist set for further need
 * 
 */
let enterName = document.querySelector('#enterName');
/**
 * This variable ist set for further need
 * 
 */
let enterEmail = document.querySelector('#enterEmail');
/**
 * This variable ist set for further need
 * 
 */
let enterPhone = document.querySelector('#enterPhone');
/**
 * This variable ist set for further need
 * 
 */
let enterPassword = document.querySelector('#enterPassword');
/**
 * This variable ist set for further need
 * 
 */
let enterConfirmPassword = document.querySelector('#enterConfirmPassword');

let insertBtn = document.querySelector('#insert');
let updateBtn = document.querySelector('#update');
let removeBtn = document.querySelector('#remove');
let findBtn = document.querySelector('#find');

/**
 * This function adds a new data to the firebase database
 * 
 * @param {string} path - the subpath for choosing the right database 'join/users/' or 'join/tasks/'
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

/* 
insertBtn.addEventListener('click', insertData);
updateBtn.addEventListener('click', updateData);
removeBtn.addEventListener('click', removeData);
findBtn.addEventListener('click', findData);
 */

function writeUserData(userId, name, email) {
    set(ref(database, "join/users/" + userId), {
        username: name,
        email: email,
    }).then(() => {
        console.log("Daten erfolgreich gespeichert!");
    }).catch((error) => {
        console.error("Fehler beim Speichern:", error);
    });
}

