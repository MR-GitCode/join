const BASE_URL =
  'https://join-441-f6d95-default-rtdb.europe-west1.firebasedatabase.app/';

let users = [];
let tasks = [];
let loggedInUser = null;

/**
 * Lädt Benutzer + deren untergeordnete Tasks.
 */
export async function loadData() {
  try {
    /* ---------- USERS + TASKS ---------- */
    const usersRes = await fetch(`${BASE_URL}/users.json`);
    const usersJson = await usersRes.json();

    users = [];
    tasks = [];

    if (usersJson) {
      for (const [uid, user] of Object.entries(usersJson)) {
        user.id = Number(uid);
        users.push(user);

        /* Tasks des Users einsammeln */
        if (user.tasks) {
          for (const [tid, task] of Object.entries(user.tasks)) {
            task.id = Number(tid);
            /* userId ergänzen, falls noch nicht vorhanden */
            if (typeof task.userId === 'undefined') task.userId = user.id;
            tasks.push(task);
          }
        }
<<<<<<< HEAD
      }
=======

        // load tasks
        let tasksData = await fetch(`${BASE_URL}/tasks.json`);
        let tasksJson = await tasksData.json();

        tasks = [];
        if (tasksJson) {
            for (let [id, task] of Object.entries(tasksJson)) {
                task.id = parseInt(id);
                tasks.push(task);
            }
        }

        // find the user
        loggedInUser = users.find(u => u.login === 1);
    } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
>>>>>>> 2525f66c4b781e589dcf4c4fe17549542a91b54a
    }

    /* Eingeloggten User bestimmen */
    loggedInUser = users.find(u => u.login === 1);

    /* Debug-Ausgaben */
    console.log('👥 Users geladen:', users.length);
    console.log('📝 Tasks geladen:', tasks.length);
  } catch (err) {
    console.error('❌ Fehler beim Laden der Daten:', err);
  }
}

<<<<<<< HEAD
/* ---------- Daten speichern / löschen ---------- */
async function transmitData(path = '', data = {}) {
  const res = await fetch(`${BASE_URL}/${path}.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  await loadData();
  return res.json();
}
=======
/**
 * This function saves the data in the database.
 * 
 * @param {string} path - The subpath to the database given from the saveData function.
 * @param {string} data - The data to save given from the saveData function.
 */
async function transmitData(path = '', data = {}) {
    let response = await fetch(`${BASE_URL}/${path}.json`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });  
    await loadData();
    return await response.json();
};
>>>>>>> 2525f66c4b781e589dcf4c4fe17549542a91b54a

export async function saveData(path = '', data = null) {
<<<<<<< HEAD
  if (data) await transmitData(path, data);
=======
    // console.log(path, data);
    if (data) {
       await transmitData(path, data)
    }
>>>>>>> 2525f66c4b781e589dcf4c4fe17549542a91b54a
}

export async function deleteData(path = '', id) {
  const res = await fetch(`${BASE_URL}/${path}/${id}.json`, {
    method: 'DELETE'
  });
  await loadData();
  return res.json();
}

/* ---------- Getter ---------- */
export function getTasks() {
  if (!loggedInUser) return [];
  return tasks.filter(
    t =>
      Number(t.userId) === loggedInUser.id ||
      Number(t.userId) === 0 ||
      typeof t.userId === 'undefined'
  );
}

export function getLoggedInUser() {
  return loggedInUser;
}

export function getUsers() {
  return users;
}
