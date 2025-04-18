// Funktion, die die Aufgaben bis zur nächsten Deadline anzeigt
function displayTasksUntilNextDeadline() {
    const today = new Date(); // Heute Datum
    let upcomingTasks = [];

    // Durchlaufe alle Aufgaben und finde die, deren Deadline noch nicht vergangen ist
    tasks.forEach(task => {
        const taskEndDate = new Date(task.enddate); // Konvertiere die Deadline der Aufgabe in ein Datum
        if (taskEndDate >= today) {
            upcomingTasks.push(task);
        }
    });

    // Sortiere die Aufgaben nach dem Enddatum (nächste Deadline zuerst)
    upcomingTasks.sort((a, b) => new Date(a.enddate) - new Date(b.enddate));

    // Zeige die Aufgaben an (du kannst die Darstellung anpassen)
    upcomingTasks.forEach(task => {
        console.log(`Titel: ${task.title}`);
        console.log(`Deadline: ${task.enddate}`);
        console.log(`Status: ${task.status}`);
        console.log('----------------------------------');
    });                                                         

    return upcomingTasks;
}



function createGreeting() {
    const now = new Date();
    const hours = now.getHours();
    let greeting;

    if (hours >= 5 && hours < 12) {
        greeting = "Guten Morgen";
    } else if (hours >= 12 && hours < 18) {
        greeting = "Guten Tag";
    } else if (hours >= 18 && hours < 22) {
        greeting = "Guten Abend";
    } else {
        greeting = "Gute Nacht";
    }

    return `
        <div id="greeting-container" class="greeting-container">
            <h2>${greeting}</h2>
        </div>
    `;
}








