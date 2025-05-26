import { loadData, getTasks } from '../db.js';

/** Navigiert zur gewünschten Seite */
function navigateTo(page) {
    window.location.href = page;
}
window.navigateTo = navigateTo;

/** Erstellt ein To-Do-Kachel-Element */
function createSummaryTodo(icon, number, label, link = './board.html') {
    return `
        <div class="summary-todo" onclick="navigateTo('${link}')">
            <img class="icon-summary" src="${icon}" alt="${label}">
            <div class="number-container">
                <div class="number">${number}</div>
                <span>${label}</span>
            </div>
        </div>
    `;
}

/** Erstellt ein Status-Kachel-Element mit nächster Deadline */
function createSummaryTaskStatus(date, info, link = './board.html') {
    const deadline = new Date(date);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = deadline.toLocaleDateString('en', options);

    return `
        <div class="summary-task-status" onclick="navigateTo('${link}')">
            <img class="icon-summary" src="./assets/icons/urgent-icon.png" alt="urgent">
            <div class="number-urgent-container">
                <div class="number">1</div>
                <span>Urgent</span>  
            </div>
            <img class="vector" src="./assets/icons/Vector 5.png">
            <div class="info-date">
                <span class="date">${formattedDate}</span>
                <span class="info">${info}</span>
            </div>
        </div>
    `;
}

/** Erstellt ein Zähler-Kachel-Element */
function createSummaryCount(number, label, link = './board.html') {
    return `
        <div class="count" onclick="navigateTo('${link}')">
            <div class="number-container">
                <div class="number">${number}</div>
                <span>${label}</span>
            </div>
        </div>
    `;
}

/** Gibt die Anzahl der Tasks mit bestimmtem Status zurück */
function countTasksByStatus(tasks, status) {
    return tasks.filter(task => task.status.toLowerCase() === status.toLowerCase()).length;
}

/** Gibt die nächste anstehende Aufgabe mit Deadline zurück */
function getNextDeadlineTask(tasks) {
    const today = new Date();
    const upcoming = tasks.filter(t => new Date(t.enddate) >= today);
    upcoming.sort((a, b) => new Date(a.enddate) - new Date(b.enddate));
    return upcoming[0];
}

/** Lädt Daten und rendert die Task-Übersicht */
document.addEventListener("DOMContentLoaded", async function () {
    await loadData();
    const tasks = getTasks();
    const taskContainer = document.querySelector(".task");

    const todoCount = countTasksByStatus(tasks, 'todo');
    const doneCount = countTasksByStatus(tasks, 'done');
    const inProgress = countTasksByStatus(tasks, 'inprogress'); // angepasst!
    const feedback = countTasksByStatus(tasks, 'review'); // oder 'feedback'?
    const total = tasks.length;
    const deadlineTask = getNextDeadlineTask(tasks);

    taskContainer.innerHTML = `
        <div class="summary-content"> 

            <div class="todo">
                ${createSummaryTodo('./assets/icons/pencil.png', todoCount, 'To-Do')}
                ${createSummaryTodo('./assets/icons/check.png', doneCount, 'Done')}
            </div>

            ${deadlineTask 
                ? createSummaryTaskStatus(deadlineTask.enddate, deadlineTask.title)
                : '<div class="summary-task-status">Keine anstehende Deadline</div>'
            }

            <div class="summary-count">
                ${createSummaryCount(total, 'Tasks in Board')}
                ${createSummaryCount(inProgress, 'Task in Progress')}
                ${createSummaryCount(feedback, 'Awaiting Feedback')}
            </div>
        </div>
    `;
});
