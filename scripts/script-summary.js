import { loadData, getTasks } from './db.js';

async function displayTasksUntilNextDeadline() {
    await loadData();
    const tasks = getTasks();

    const today = new Date();
    let upcomingTasks = [];

    tasks.forEach(task => {
        const taskEndDate = new Date(task.enddate);
        if (taskEndDate >= today) {
            upcomingTasks.push(task);
        }
    });

    upcomingTasks.sort((a, b) => new Date(a.enddate) - new Date(b.enddate));
    upcomingTasks.forEach(task => {
        console.log(`Titel: ${task.title}`);
        console.log(`Deadline: ${task.enddate}`);
        console.log(`Status: ${task.status}`);
        console.log('----------------------------------');
    });

    return upcomingTasks;
}


function createGreeting(firstName, lastName) {
  const now = new Date();
  const hour = now.getHours();
  let greeting;

  if (hour < 12) {
    greeting = "Good morning";
  } else if (hour < 18) {
    greeting = "Good day";
  } else {
    greeting = "Good evening";
  }

  return `${greeting}, <span class="highlight-name">${firstName} ${lastName}</span>!`;
}

document.addEventListener("DOMContentLoaded", () => {
  const firstName = "Sarah";
  const lastName = "Müller";
  document.getElementById("greeting").innerHTML = createGreeting(firstName, lastName);
});












