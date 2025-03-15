const BASE_URL = 'https://join-441-default-rtdb.europe-west1.firebasedatabase.app/join/';

async function loadData() {
    try {
        let usersData = await fetch(`${BASE_URL}/users.json`);
        users = (await usersData.json()) || [];

        let tasksData = await fetch(`${BASE_URL}/tasks.json`);
        tasks = (await tasksData.json()) || [];
    } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
    }
};

/* type = 'users' || 'tasks' || '' (alle Daten) und data = null (alle Daten) oder id */
function saveData(type = '', data = null) {
    if (data) {
        transmitData(type, data);
    } else {
        users.forEach(user => transmitData('users', user));
        tasks.forEach(task => transmitData('tasks', task));
    }
};

async function transmitData(path = '', data = {}) {
    let response = await fetch(`${BASE_URL}/${path}/${data.id}.json`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    return await response.json();
};

async function deleteData(path = '', id) {
    let response = await fetch(`${BASE_URL}/${path}/${id}.json`, {
        method: 'DELETE',
    });
    return await response.json();
};

