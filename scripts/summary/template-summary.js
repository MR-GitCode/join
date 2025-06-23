/**
 * 
 * @param {} page 
 */
export function navigateTo(page) {
  window.location.href = page; 
}

/**
 * Returns the template of the greeting message.
 * @param {string} greetingText This is text with the greeting.
 * @param {string} userName This is name of the user.
 * @returns 
 */
export function createDayGreeting(greetingText, userName) {
  return `
    <div id="greeting">
      <h2>${greetingText}, <span class="highlight-name">${userName}</span>!</h2>
    </div>
  `;
}

/**
 * Returns the template with the summary information of todo and done task.
 * @param {string} icon Path of the icon source. 
 * @param {number} number Amount of the todo or done task.
 * @param {string} label This is the label "todo" and "done"
 * @param {string} link Path with the link to the board.
 * @returns 
 */
export function createSummaryTodo(icon, number, label, link = './board.html') {
  return `
    <div class="summary-todo" data-link="${link}">
      <img class="icon-summary" src="${icon}" alt="${label}">
      <div class="number-container">
        <div class="number">${number}</div>
        <span>${label}</span>
      </div>
    </div>
  `;
}

/**
 * Returns the template with the upcoming deadline of the task.
 * @param {string} date The date of the deadline.
 * @param {string} info The information text.
 * @param {string} link Path with the link to the board.
 * @returns 
 */
export function createSummaryTaskStatus(date, info, link = './board.html') {
  return `
    <div class="summary-task-status" data-link="${link}">
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

/**
 * Returns the template with the amount of the task  "in total", "in progress", "await feedback"
 * @param {number} number The amount of the task
 * @param {string} label The label of the category
 * @param {string} link Path with the link to the board.
 * @returns 
 */
export function createSummaryCount(number, label, link = './board.html') {
  return `
    <div class="count" data-link="${link}">
      <div class="number-container">
        <div class="number">${number}</div>
        <span>${label}</span>
      </div>
    </div>
  `;
}

/**
 * Returns the template of the amount summary of the tasks 
 * @param {*} taskCounts 
 * @param {*} deadline 
 * @returns 
 */
export function createSummaryOfTasks(taskCounts, deadline) {
  return `<div class="row">
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