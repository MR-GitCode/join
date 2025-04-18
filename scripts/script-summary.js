import {loadData, getTasks} from './db.js';


function displayTasksUntilNextDeadline() {
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

function createGreeting(name) {
    const now = new Date();
    const hour = now.getHours();
    let greeting;
  
    if (hour < 12) {
      greeting = "good morning";
    } else if (hour < 18) {
      greeting = "Good day";
    } else {
      greeting = "good evening";
    }
  
    return `${greeting}, ${name}!`;
  }

  document.addEventListener("DOMContentLoaded", () => {
    const name = "Sarah"; 
    document.getElementById("greeting").textContent = createGreeting(name);
  });










