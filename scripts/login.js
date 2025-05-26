import { loadData, getUsers, saveData } from './db.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

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
      const updatedUsers = users.map((user) => ({
        ...user,
        login: user.email === foundUser.email ? 1 : 0,
      }));

      const userData = {};
      updatedUsers.forEach((u) => {
        userData[u.id] = { ...u };
        delete userData[u.id].id;
      });

      await saveData('users', userData);

      const [firstName, lastName] = foundUser.name.split(' ');
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: foundUser.id,
          firstName,
          lastName,
          badge: foundUser.badge,
        })
      );

      window.location.href = './summary.html';
    } else {
      alert('Ungültige Anmeldedaten!');
    }
  });
});

window.addEventListener('load', () => {
  const logo = document.querySelector('.logo-fly');
  const pageContent = document.getElementById('page-content');

  logo.addEventListener('animationend', () => {
    pageContent.classList.remove('page-content-hidden');
  });
});

document.getElementById('guestBtn').addEventListener('click', async () => {
  await loadData();
  const users = getUsers();

  const guestUser = users.find((user) => user.name === 'Gast');

  if (guestUser) {
    const updatedUsers = users.map((user) => ({
      ...user,
      login: user.id === guestUser.id ? 1 : 0,
    }));

    const userData = {};
    updatedUsers.forEach((u) => {
      userData[u.id] = { ...u };
      delete userData[u.id].id;
    });

    await saveData('users', userData);

    localStorage.setItem(
      'user',
      JSON.stringify({
        id: guestUser.id,
        firstName: 'Gast',
        lastName: '',
        badge: guestUser.badge,
      })
    );

    window.location.href = './summary.html';
  } else {
    alert('Gastnutzer nicht gefunden!');
  }
});


