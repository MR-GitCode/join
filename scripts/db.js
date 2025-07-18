const BASE_URL = 'https://join-441-f6d95-default-rtdb.europe-west1.firebasedatabase.app';

let users = [];
let loggedInUser = null;

/**
 * Loads user from the database.
 */
export async function loadData() {
  try {
    const usersRes = await fetch(`${BASE_URL}/users.json`);
    const usersJson = await usersRes.json();
    users = [];
    if (usersJson) {
      for (const [uid, user] of Object.entries(usersJson)) {
        user.id = Number(uid);
        users.push(user);
      }
    }
    const storedUser = JSON.parse(localStorage.getItem('user'));
    loggedInUser = storedUser ? users.find(u => u.id === storedUser.id) : null;
  } catch (error) {
    console.error('error to load', error);
  }
}

/**
 * Sends (overwrites) data to a specific path in the backend and reloads all user/task data.
 * @param {string} path The relative path (excluding `.json`) to send the data to.
 * @param {object} data The JavaScript object to be transmitted to the database.
 * @returns 
 */
async function transmitData(path = '', data = {}) {
  const res = await fetch(`${BASE_URL}/${path}.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  await loadData();
  return res.json();
}

/**
 * Saves data to a specific path in the backend.
 * @param {string} path The relative path (excluding `.json`) to send the data to.
 * @param {object} data The JavaScript object to be transmitted to the database.
 */
export async function saveData(path = '', data = null) {
  if (data) await transmitData(path, data);
}

/**
 * Deletes a specific data entry from the backend by ID.
 * @param {*} path The backend resource path
 * @param {*} id The ID of the data entry to be deleted.
 * @returns 
 */
export async function deleteData(path = '', id) {
  const res = await fetch(`${BASE_URL}/${path}/${id}.json`, {
    method: 'DELETE'
  });
  await loadData();
  return res.json();
}

/**
 * 
 * @returns Return informations of the user
 */
export function getLoggedInUser() {
  return loggedInUser;
}

/**
 * 
 * @returns Return informations of the users
 */
export function getUsers() {
  return users;
}