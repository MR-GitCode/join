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
  `
}

/**
 * Returns the template with the summary information of todo and done task.
 * @param {string} icon Path of the icon source. 
 * @param {number} number Amount of the todo or done task.
 * @param {string} label This is the label "todo" and "done"
 * @param {string} link Path with the link to the board.
 * @returns 
 */
export function createSummaryTodo(icon, number, label) {
  return `<a href="./board.html" id="summary-${label}">
            <div class="summary-todo">
              ${icon}
              <div class="number-container">
                <div class="number">${number}</div>
                <span>${label}</span>
              </div>
            </div>
          </a>
        `
}

/**
 * Returns the template with the upcoming deadline of the task.
 * @param {string} date The date of the deadline.
 * @param {string} info The information text.
 * @param {string} link Path with the link to the board.
 * @returns 
 */
export function createSummaryTaskStatus(number ,date, info) {
  return `<a href="./board.html">
            <div class="summary-task-status">
              <img class="icon-summary" src="./assets/icons/urgent-icon.png" alt="urgent">
              
              <div class="number-urgent-container">
                <div class="number">${number}</div>
                <span>Urgent</span>
              </div>

              <div class="vector-container">
                <img class="vector" src="./assets/icons/summary/vector.png" alt="Trennlinie">
              </div>

              <div class="info-date">
                <span class="date">${date}</span>
                <span class="info">${info}</span>
              </div>
            </div>
          </a>`
}

/**
 * Returns the template with the amount of the task  "in total", "in progress", "await feedback"
 * @param {number} number The amount of the task
 * @param {string} label The label of the category
 * @param {string} link Path with the link to the board.
 * @returns 
 */
export function createSummaryCount(number, label) {
  return `<a href="./board.html">
            <div class="count">
              <div class="number-container">
                <div class="number">${number}</div>
                <span>${label}</span>
              </div>
            </div>
          </a>`
}

/**
 * Returns the template of the amount summary of the tasks 
 * @param {*} taskCounts 
 * @param {*} deadline 
 * @returns 
 */
export function createSummaryOfTasks(taskCounts, deadline) {
  return `<div class="row">
            ${createSummaryTodo('<svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="35.3945" cy="34.8083" r="34.5" fill="#2A3647"/><mask id="mask0_62_577" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="19" y="18" width="33" height="33"><rect x="19.3945" y="18.8083" width="32" height="32" fill="#D9D9D9"/></mask><g mask="url(#mask0_62_577)"><path d="M26.0612 44.1418H27.9279L39.4279 32.6418L37.5612 30.7751L26.0612 42.2751V44.1418ZM45.1279 30.7084L39.4612 25.1084L41.3279 23.2418C41.839 22.7307 42.4668 22.4751 43.2112 22.4751C43.9556 22.4751 44.5834 22.7307 45.0945 23.2418L46.9612 25.1084C47.4723 25.6195 47.739 26.2362 47.7612 26.9584C47.7834 27.6807 47.539 28.2973 47.0279 28.8084L45.1279 30.7084ZM43.1945 32.6751L29.0612 46.8084H23.3945V41.1418L37.5279 27.0084L43.1945 32.6751Z" fill="white"/></g></svg>', taskCounts.todo, 'To-do')}
            ${createSummaryTodo('<svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="34.8945" cy="34.8083" r="34.5" fill="#2A3647"/><path d="M19.9229 34.8085L31.1516 45.8745L49.8662 23.7424" stroke="white" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>', taskCounts.done, 'Done')}
          </div>
          <div class="row">
            ${createSummaryTaskStatus(taskCounts.urgent.length , deadline, 'Upcoming Deadline')}
          </div>
          <div class="row">
            ${createSummaryCount(taskCounts.total, 'Tasks in Board')}
            ${createSummaryCount(taskCounts.inProgress, 'Tasks in Progress')}
            ${createSummaryCount(taskCounts.feedback, 'Await Feedback')}
          </div>
        `  
}