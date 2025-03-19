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




