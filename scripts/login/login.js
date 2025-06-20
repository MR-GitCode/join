import { loadData, getUsers, saveData } from '../db.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const guestBtn = document.getElementById('guestBtn');
  const logo = document.querySelector('.logo-fly');
  const pageContent = document.getElementById('page-content');
  visiblePassword()

  // USER LOGIN
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value.trim();

      await loadData();
      const users = getUsers();

      console.log('Geladene Benutzer:', users); // Debugging

      const foundUser = users.find(
        (user) => user.email === email && user.password === password
      );

      if (foundUser) {
        // Setze bei allen login = 0, außer bei gefundenem Nutzer
        const userData = {};
        users.forEach((user) => {
          const updatedUser = { ...user, login: user.id === foundUser.id ? 1 : 0 };
          userData[user.id] = {
            ...updatedUser
          };
          delete userData[user.id].id; 
        });

        await saveData('users', userData);

        const [firstName, lastName = ''] = foundUser.name.split(' ');
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
        alert('❌ Ungültige Anmeldedaten!');
        console.warn('Login fehlgeschlagen für:', email);
      }
    });
  }

  //guest login
  if (guestBtn) {
    guestBtn.addEventListener('click', async () => {
      await loadData();
      const users = getUsers();
      const guestUser = users.find((user) => user.id === 0);

      if (guestUser) {
        const userData = {};
        users.forEach((user) => {
          const updatedUser = { ...user, login: user.id === guestUser.id ? 1 : 0 };
          userData[user.id] = {
            ...updatedUser
          };
          delete userData[user.id].id;
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
        alert('❌ Gastnutzer nicht gefunden!');
      }
    });
  }

  // animation logo
  logo?.addEventListener('animationend', () => {
    pageContent?.classList.remove('page-content-hidden');
  });
});

//overlay

const modal = document.getElementById('signupModal');
const openBtn = document.getElementById('openSignUpBtn');

openBtn.addEventListener('click', () => {
  modal.classList.add('active');
});

function closeModal() {
  modal.classList.remove('active');
}

// Optional: Close modal by clicking outside the container
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
    }
});

function visiblePassword() {
  let input = document.getElementById("loginPassword");
  let icon = document.getElementById('lockedIcon')
  input.addEventListener('focus', () => {
    icon.src = "./assets/icons/visibility_off.svg"
  })
  input.addEventListener('input', () => {
    icon.src = "./assets/icons/visibility_off.svg"
  })
  icon.addEventListener('click', () => {
    if (input.type === "password") {
      input.type = "text";
      icon.src = "./assets/icons/visibility.svg"
    } else {
      input.type = "password";
      icon.src = "./assets/icons/visibility_off.svg"
  }})
}