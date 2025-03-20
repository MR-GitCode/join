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

// Beispielhafte Anzeige der Aufgaben bis zur nächsten Deadline
displayTasksUntilNextDeadline();






