import { loadData, getTasks, getLoggedInUser } from '../db.js';
import { createDayGreeting , createSummaryOfTasks} from './template-summary.js';

document.addEventListener('DOMContentLoaded', loadSummary);

/**
 * Loads the summary. 
 * @returns 
 */
async function loadSummary() {
  await loadData();
  const tasks = getTasks();
  const user = getLoggedInUser();
  if (!tasks || !user) {
    console.warn("No tasks or logged in user found.");
    return;
  }
  showGreeting(user)
  renderSummary(tasks);
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
  const nearestUrgent = taskCounts.urgent.sort((a, b) => new Date(a.enddate) - new Date(b.enddate))[0];
  const deadline = nearestUrgent ? formatDate(nearestUrgent.enddate) : 'No deadlines';
  taskContent.innerHTML = createSummaryOfTasks(taskCounts, deadline) 
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