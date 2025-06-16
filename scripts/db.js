const BASE_URL = 'https://join-441-f6d95-default-rtdb.europe-west1.firebasedatabase.app';

let users = [];
let tasks = [];
let loggedInUser = null;

/**
 * load user and Tasks 
 */
export async function loadData() {
  try {
    const usersRes = await fetch(`${BASE_URL}/users.json`);
    const usersJson = await usersRes.json();

    users = [];
    tasks = [];

    if (usersJson) {
      for (const [uid, user] of Object.entries(usersJson)) {
        user.id = Number(uid);
        users.push(user);
        if (user.tasks) {
          for (const [tid, task] of Object.entries(user.tasks)) {
            task.id = Number(tid);
            if (typeof task.userId === 'undefined') task.userId = user.id;
            tasks.push(task);
          }
        }
      }
    }

  
    loggedInUser = users.find(u => u.login === 1);

    // 🐞 Debug
    console.log('👥 Users geladen:', users.length);
    console.log('📝 Tasks geladen:', tasks.length);
  } catch (error) {
    console.error('❌ error to load', error);
  }
}

/**
 * send data (PUT) on Firebase.
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
 * save data 
 */
export async function saveData(path = '', data = null) {
  if (data) await transmitData(path, data);
}

/**
 * delete data 
 */
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

