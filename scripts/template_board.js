
// Muss noch angepasst werden

function loadCard(taskID) {
    return `<div class="card">
                <div class="tpl-progress">
                    <div class="card-category bg-${taskID.category}">User Story</div>
                        <div class="card-text">
                            <p class="card-title">${taskID.title}</p>
                            <p class="card-description">${taskID.description}</p>
                        </div>
                        <div class="card-progress">
                            <div class="progress-bar"></div>
                            <div class="card-subtasks">0/${taskID.subtasks.lenght} Subtasks</div>
                        </div>
                        <div class="card-contact">
                            <div class="card-badges">
                                <img src="./assets/icons/profilebadge/${taskID.assignedID}.svg">
                            </div>
                        <div>
                            <img src="./assets/icons/add_task/Prio_${taskID.piority}.svg">
                        </div>
                    </div>
                </div>
            </div>`
}