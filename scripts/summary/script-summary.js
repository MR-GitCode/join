import { loadData, getTasks, getLoggedInUser } from '../db.js';
import {
  createSummaryTodo,
  createSummaryTaskStatus,
  createSummaryCount,
  createDayGreeting,
  navigateTo
} from './template-summary.js';

document.addEventListener('DOMContentLoaded', loadSummary);

async function loadSummary() {
  console.log("🚀 Lade Summary...");
  await loadData(); // Lade Daten
  console.log("✅ Daten geladen.");

  const tasks = getTasks();
  const user = getLoggedInUser();

  console.log("👤 Eingeloggter Benutzer:", user);
  console.log("📋 Gefilterte Tasks:", tasks);

  if (!tasks || !user) {
    console.warn("⚠️ Keine Tasks oder kein eingeloggter Benutzer gefunden.");
    return;
  }

  // 👋 Begrüßung anzeigen
  const greetingText = getEnglishGreeting();
  const greetingHtml = createDayGreeting(greetingText, user.name);
  const greetingElement = document.querySelector('.greeting-container');
  if (greetingElement) {
    greetingElement.innerHTML = greetingHtml;
    console.log("👋 Begrüßung angezeigt:", `${greetingText}, ${user.name}`);
  } else {
    console.warn("⚠️ Kein Element mit Klasse 'greeting-container' gefunden.");
  }

  // 🖼️ Profilbadge automatisch setzen (inkl. Gast-Login)
  const profileBadgeImg = document.getElementById('profile-badge');

  if (!profileBadgeImg) {
    console.warn("⚠️ Kein Profilbild mit ID 'profile-badge' gefunden.");
  } else if (user) {
    let badgePath;

    if (!user.id || user.name?.toLowerCase() === 'gast' || user.guest === true) {
      // Fallback für Gast oder fehlende ID
      badgePath = './assets/icons/profilebadge/guest.svg';
    } else {
      // Pfad mit user.id
      badgePath = `./assets/icons/profilebadge/${user.id}.svg`;
    }

    profileBadgeImg.src = badgePath;
    console.log("🖼️ Profilbadge gesetzt:", badgePath);
  } else {
    console.warn("⚠️ Kein gültiger Benutzer vorhanden.");
  }

  
  renderSummary(tasks);
}

function getEnglishGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function renderSummary(tasks) {
  const taskContent = document.querySelector('.task-content');
  if (!taskContent) {
    console.warn("⚠️ Kein Element mit Klasse 'task-content' gefunden.");
    return;
  }

  const taskCounts = {
    todo: 0,
    done: 0,
    inProgress: 0,
    feedback: 0,
    urgent: [],
    total: tasks.length,
  };

  for (let task of tasks) {
    if (task.status === 'todo') taskCounts.todo++;
    if (task.status === 'done') taskCounts.done++;
    if (task.status === 'inprogress') taskCounts.inProgress++;
    if (task.status === 'review') taskCounts.feedback++;
    if (task.priority === 'urgent') taskCounts.urgent.push(task);
  }

  console.log("📊 Task-Zusammenfassung:", taskCounts);

  const nearestUrgent = taskCounts.urgent.sort((a, b) => new Date(a.enddate) - new Date(b.enddate))[0];
  const deadline = nearestUrgent ? formatDate(nearestUrgent.enddate) : 'Keine';

  taskContent.innerHTML = `
    <div class="row">
      ${createSummaryTodo('./assets/icons/summary/pencil.svg', taskCounts.todo, 'To-do')}
      ${createSummaryTodo('./assets/icons/summary/check.svg', taskCounts.done, 'Done')}
    </div>
    <div class="row">
      ${createSummaryTaskStatus(deadline, 'Upcoming Deadline')}
    </div>
    <div class="row">
      ${createSummaryCount(taskCounts.total, 'Tasks in Board')}
      ${createSummaryCount(taskCounts.inProgress, 'Tasks in Progress')}
      ${createSummaryCount(taskCounts.feedback, 'Await Feedback')}
    </div>
  `;
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });
}



