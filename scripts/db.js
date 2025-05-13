/**
  * This variable ist set constant for the Path to the Database.
  * 
  * @param {string} BASE_URL - The URL of the database.
  */
const BASE_URL = 'https://join-441-f6d95-default-rtdb.europe-west1.firebasedatabase.app/';

let users = {};
let tasks = {};
let loggedInUser = null;

/**
 * This function loads all the datas from the database.
 * 
 * @param {string} BASE_URL - The URL of the database.
 * @param {string} users - For storing the users from the database.
 * @param {string} tasks - For storing the tasks to be done from the database.
 */
export async function loadData() {
    try {
        let usersData = await fetch(`${BASE_URL}/users.json`);
        let usersJson = await usersData.json();
        users = usersJson ? Object.values(usersJson) : [];
        
        let tasksData = await fetch(`${BASE_URL}/tasks.json`);
        let tasksJson = await tasksData.json();
        tasks = tasksJson ? Object.values(tasksJson) : [];     
         
    } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
    }
    loggedInUser = users.find(u => u.login == 1);  
};

// /**
//  * This function saves the data in the database using the transmitData function.
//  *
//  * @param {string} type - The type of data to save. Use 'users' for users, 'tasks' for tasks and '' (standard value) for all datas.
//  * @param {string} data - The data to save. Use the id-number for 1 entry or null (standard value) for all datas.
//  * 
// /* type = 'users' || 'tasks' || '' (alle Daten) und data = null (alle Daten) oder id */
// export async function saveData(type = '', data = null) {
//     console.log(type, data);
//     if (data) {
//         return await transmitData(type, data);
//         return await transmitData(`${type}/${data.id}`, data);
//     } else {
//         let userPromises = users.map(user => transmitData('users', user));
//         let taskPromises = tasks.map(task => transmitData('tasks', task));
//         return await Promise.all([...userPromises, ...taskPromises]);    }
// };

/**
 * This function safes the data in the database.
 * 
 * @param {string} path - The subpath to the database given from the saveData function.
 * @param {string} data - The data to save given from the saveData function.
 */
async function transmitData(path = '', data = {}) {
    let response = await fetch(`${BASE_URL}/${path}/${data.id}.json`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    await loadData();
    return await response.json();
};

//NEW saveData
export async function saveData(path = '', data = null) {
    // console.log(path, data);
    if (data) {
        transmitData(path, data)
    }
}

/**
 * This function deletes one Data.
 * 
 * @param {*} path - The path to the data to be deleted. Use 'users' for users and 'tasks' for tasks.
 * @param {*} id - The id of the data to be deleted.
 */
export async function deleteData(path = '', id) {
    switch (id) {
        case 8:
            break;

        default:
            let response = await fetch(`${BASE_URL}/${path}/${id}.json`, {
                method: 'DELETE',
            });
            return await response.json();
            break;
    }
};

//löschen wenn es nicht mehr gebraucht wird
export function getTasks() {
    console.log(tasks);    
    return tasks;
}

export function getUsers() {
    console.log(users);    
    return users;
}

/**
 * 
 * @returns Return the loggedInUser Object with all 
 */
export function getLoggedInUser() {
    // console.log('Logged in User', loggedInUser);
    return loggedInUser;
}