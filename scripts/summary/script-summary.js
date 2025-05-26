import { loadData, getTasks } from '../db.js';

/** Gibt Begrüßung nach Tageszeit zurück */
function createGreeting(firstName, lastName) {
  const hour = new Date().getHours();
  let greeting = "Good evening";

  if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";

  return `${greeting}, <span class="highlight-name">${firstName} ${lastName}</span>!`;
}

document.addEventListener("DOMContentLoaded", async () => {
  // Begrüßung
  const userData = localStorage.getItem("user");
  if (userData) {
    const { firstName, lastName } = JSON.parse(userData);
    document.getElementById("greeting").innerHTML = createGreeting(firstName, lastName);
  } else {
    document.getElementById("greeting").textContent = "Welcome!";
  }

  // Lade Tasks für Konsole
  await loadData();
  const tasks = getTasks();
  const today = new Date();

  const upcoming = tasks.filter(task => new Date(task.enddate) >= today)
                        .sort((a, b) => new Date(a.enddate) - new Date(b.enddate));

  console.log('Nächste Aufgaben mit Deadline:');
  upcoming.forEach(task => {
    console.log(`- ${task.title} (bis ${task.enddate}) [${task.status}]`);
  });
});

/** Dropdown-Profilmenü */
document.addEventListener("DOMContentLoaded", function () {
  const profileImg = document.getElementById('profile-img');
  const navbar = document.getElementById('navbar');

  profileImg?.addEventListener('click', (e) => {
    e.stopPropagation();
    navbar.classList.toggle('show');
  });

  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && !profileImg.contains(e.target)) {
      navbar.classList.remove('show');
    }
  });
});
















