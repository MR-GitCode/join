/**
 * 
 * @param {number} taskID This is the ID of the task. 
 * @returns Return the template of the task.
 */
function loadCard(taskID) {
    return `<div id="${taskID.id}" class="card">
                <div class="tpl-progress">
                    <div class="card-category bg">${taskID.category}</div>
                        <div class="card-text">
                            <p class="card-title">${taskID.title}</p>
                            <p class="card-description">${taskID.description}</p>
                        </div>
                        <div class="card-progress">
                            <div class="progress-bar"></div>
                            <div class="card-subtasks">0/2 Subtasks</div>
                        </div>
                        <div class="card-contact">
                            <div id="card${taskID.id}-contacts" class="card-badges"></div>
                        <div>
                            <img src="./assets/icons/add_task/Prio_${taskID.priority}.svg">
                        </div>
                    </div>
                </div>
            </div>`
}

/**
 * 
 * @param {nummber} assignedContact This is the user ID of the Contact.
 * @returns Return the img of the bages of the user.
 */
function loadBagesForCard(assignedContact) {
    return `<img src="./assets/icons/profilebadge/${assignedContact}.svg">`
}