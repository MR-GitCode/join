// Zentrale Funktion für Navigation
function navigateTo(page) {
    window.location.href = page;
}

// Template für die To-Do-Elemente
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

// Template für den Task-Status
function createSummaryTaskStatus(date, info, link = './board.html') {
    return `
        <div class="summary-task-status" onclick="navigateTo('${link}')">
            <img class="icon-summary" src="./assets/icons/urgent-icon.png" alt="urgent">
            <div class="number-urgent-container">
                <div class="number">1</div>
                <span>Urgent</span>
                <img class="vector" src="./assets/icons/Vector 5.png">
            </div>
            <div class="info-date">
                <span class="date">${date}</span>
                <span class="info">${info}</span>
            </div>
        </div>
    `;
}

// Template für die Summary-Count-Elemente
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



// Template für den gesamten Task-Container
function createTaskContainer() {
    return `
        <div class="task-container">
            <div class="task-content">
                ${createSummaryTodo('./assets/icons/pencil.png', 1, 'To-Do')}
                ${createSummaryTodo('./assets/icons/check.png', 1, 'Done')}
                ${createSummaryTaskStatus('October 16, 2022', 'Upcoming Deadline')}
                ${createSummaryCount(5, 'Task in Board')}
            </div>
            ${createDayGreeting('Good morning')}
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", function () {
    const taskContainer = document.querySelector(".task");

    taskContainer.innerHTML = `
        <div class="summary-content"> 
            <div class="summary-header">
                <h1>Join 360 Key</h1><p>|</p>
                <span>Metrics at a Glance</span>
            </div>
            <div class="todo">
                ${createSummaryTodo('./assets/icons/pencil.png', 1, 'To-Do')}
                ${createSummaryTodo('./assets/icons/check.png', 1, 'Done')}
            </div>

            ${createSummaryTaskStatus('October 16, 2022', 'Upcoming Deadline')}

            <div class="summary-count">
                ${createSummaryCount(5, 'Task in Board')}
                ${createSummaryCount(2, 'Task in Progress')}
                ${createSummaryCount(2, 'Awaiting Feedback')}
            </div>
        </div>  <!-- Hier das schließende div hinzufügen -->
    `;
});