import { loadData, getLoggedInUser } from '../db.js';

document.addEventListener('DOMContentLoaded', loadSummary);

/**
 * Loads the summary. 
 * @returns 
 */
async function loadSummary() {
  await loadData();
  const user = getLoggedInUser();
  showGreeting(user);
  renderSummary(user.tasks);
}

/**
 * Displays a personalized greeting message with current time of day and the user name in the `.greeting-container` element.
 * @param {object} user Object with the user informations. 
 */
function showGreeting(user) {
  const greetingText = getEnglishGreeting();
  const greetingHtml = createDayGreeting(greetingText, user.name);
  const greetingElement = document.querySelector('.greeting-container');
  if (greetingElement) {
    greetingElement.innerHTML = greetingHtml;
  } else {
    console.warn("No element with class 'greeting-container' found.");
  }
}

/**
 * 
 * @returns Returns the greeting message
 */
function getEnglishGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

/**
 * Renders a summary of the provided tasks inside the `.task-content` container.
 * @param {object} tasks Object with the informations of all tasks.
 * @returns 
 */
function renderSummary(tasks) { 
  const taskContent = document.querySelector('.task-content');
  if (!taskContent) {
    console.warn("No element with class 'task-content' found.");
    return;
  }
  let taskCounts = countTasks(tasks); 
  let deadline = getNearestUrgentDeadline(taskCounts.urgent);
  taskContent.innerHTML = createSummaryOfTasks(taskCounts, deadline);
}

/**
 * Counts the number of tasks in each status category and collects urgent tasks.
 * @param {object} tasks Object with the informations of all tasks.
 * @returns 
 */
function countTasks (tasks) {
  const taskCounts = amountOfTasks(tasks);
  for (let task of tasks) {
    if (!task) continue;
    if (task.status === 'todo') taskCounts.todo++;
    if (task.status === 'done') taskCounts.done++;
    if (task.status === 'inprogress') taskCounts.inProgress++;
    if (task.status === 'review') taskCounts.feedback++;
    if (task.priority === 'urgent') taskCounts.urgent.push(task);
  }
  return taskCounts;
}

/**
 * Return the amount of the "Todo", "done" etc. of all tasks.
 * @param {object} tasks The object with all tasks informations 
 * @returns 
 */
function amountOfTasks(tasks) {
  let validTasks = Array.isArray(tasks) ? tasks.filter(task => task !== null) : [];
  return {
    todo: 0,
    done: 0,
    inProgress: 0,
    feedback: 0,
    urgent: [],
    total: validTasks.length,
  };
}

/**
 * Finds the nearest deadline among a list of urgent tasks.
 * @param {object} urgentTasks An array of urgent task objects that contain an `enddate` field.
 * @returns 
 */
function getNearestUrgentDeadline(urgentTasks) {
  if (!urgentTasks || urgentTasks.length === 0) return 'No deadlines';
    let nearest = urgentTasks.sort((a, b) => new Date(a.enddate) - new Date(b.enddate))[0];
  return formatDate(nearest.enddate);
}

/**
 * Formats a date string into a German date format.
 * @param {string} dateStr Date of the upcoming deadline
 * @returns 
 */
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });
}