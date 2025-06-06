// Navigationsfunktion (wenn du sie nicht schon in einem anderen Modul hast)
export function navigateTo(page) {
  window.location.href = page;
}

// 🟢 Begrüßung (dynamisch mit Name in Blau)
export function createDayGreeting(greetingText, userName) {
  return `
    <div id="greeting">
      <h2>${greetingText}, <span class="highlight-name">${userName}</span>!</h2>
    </div>
 ` ;
}


// 🟢 Summary-ToDo-Box
export function createSummaryTodo(icon, number, label, link = './board.html') {
  return `
    <div class="summary-todo" onclick="navigateTo('${link}')">
      <img class="icon-summary" src="${icon}" alt="${label}">
      <div class="number-container">
        <div class="number">${number}</div>
        <span>${label}</span>
      </div>
    </div>
 ` ;
}

// 🟢 Task mit Deadline
export function createSummaryTaskStatus(date, info, link = './board.html') {
  return `
    <div class="summary-task-status" onclick="navigateTo('${link}')">
      <img class="icon-summary" src="./assets/icons/urgent-icon.png" alt="urgent">
      
      <div class="number-urgent-container">
        <div class="number">1</div>
        <span>Urgent</span>
      </div>

      <div class="vector-container">
        <img class="vector" src="./assets/icons/Vector 5.png" alt="Trennlinie">
      </div>

      <div class="info-date">
        <span class="date">${date}</span>
        <span class="info">${info}</span>
      </div>
    </div>
  `;
}


// 🟢 Zähler
export function createSummaryCount(number, label, link = './board.html') {
  return `
    <div class="count" onclick="navigateTo('${link}')">
      <div class="number-container">
        <div class="number">${number}</div>
        <span>${label}</span>
      </div>
    </div>
 ` ;
}

// 🟢 Hauptcontainer (kombiniert alle Templates)

export function createTaskContainer(tasks, user) {
  // Zähle die Task-Status aus:
  const todoCount = tasks.filter(t => t.status === 'todo').length;
  const doneCount = tasks.filter(t => t.status === 'done').length;
  const inProgressCount = tasks.filter(t => t.status === 'inprogress').length;
  const feedbackCount = tasks.filter(t => t.status === 'review').length;
  const boardCount = tasks.length;

  // Finde früheste Deadline (für Upcoming Deadline)
  const upcoming = tasks
    .map(t => new Date(t.enddate))
    .sort((a, b) => a - b)[0];
  const deadline = upcoming ? upcoming.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';

  // Begrüßung mit Namen
  const greeting = createDayGreeting(user?.name || 'Gast');

  return `
    <div class="task-container-horizontal">
      <div class="task-content">
        <div class="row">
          ${createSummaryTodo('./assets/icons/pencil.png', todoCount, 'To-Do')}
          ${createSummaryTodo('./assets/icons/check.png', doneCount, 'Done')}
        </div>

        <div class="row">
          ${createSummaryTaskStatus(deadline, 'Upcoming Deadline')}
        </div>

        <div class="row">
          ${createSummaryCount(boardCount, 'Tasks in Board')}
          ${createSummaryCount(inProgressCount, 'Tasks in Progress')}
          ${createSummaryCount(feedbackCount, 'Await Feedback')}
        </div>
      </div>
      <div class="greeting-container">
        ${greeting}
      </div>
    </div>
 ` ;
}




