let tasks = [];

document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    initializeDatePickers();
    initializeDragAndDrop();
    loadTasks();
});

function initializeDatePickers() {
    // Initialize Flatpickr for both date inputs
    flatpickr("#startDate", {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        minDate: "today",
        time_24hr: true,
        placeholder: "Select start date and time"
    });

    flatpickr("#dueDate", {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        minDate: "today",
        time_24hr: true,
        placeholder: "Select due date and time"
    });
}

function initializeDragAndDrop() {
    const containers = Array.from(document.querySelectorAll('.task-list'));
    dragula(containers, {
        moves: function(el, container, handle) {
            return !handle.classList.contains('delete-btn'); // Prevent dragging when clicking delete button
        }
    }).on('drop', function(el, target, source) {
        // Update task status when dropped in new column
        const taskId = parseInt(el.dataset.taskId);
        const newStatus = target.parentElement.id; // todo, inProgress, or done
        updateTaskStatus(taskId, newStatus);
    });
}

function updateTaskStatus(taskId, newStatus) {
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        task.status = newStatus;
        saveTasks();
        
        // Refresh the task element to show/hide progress notes
        const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
        if (taskElement) {
            const newTaskElement = createTaskElement(task);
            taskElement.replaceWith(newTaskElement);
        }
        
        showNotification(`Task moved to ${newStatus.replace(/([A-Z])/g, ' $1').trim()}`);
    }
}

function setupEventListeners() {
    const form = document.getElementById('taskForm');
    form.addEventListener('submit', handleAddTask);
}

function handleAddTask(e) {
    e.preventDefault();
    
    // Get form values
    const title = document.getElementById('taskInput').value;
    const tags = document.getElementById('taskTags').value;
    const priority = document.getElementById('taskPriority').value;
    const startDate = document.getElementById('startDate').value;
    const dueDate = document.getElementById('dueDate').value;

    if (!title.trim()) {
        showNotification('Please enter a task title!');
        return;
    }

    // Create new task
    const task = {
        id: Date.now(),
        title: title,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        priority: priority,
        startDate: startDate,
        dueDate: dueDate,
        status: 'todo',
        progressNotes: '',
        createdAt: new Date().toISOString()
    };

    // Add task to array
    tasks.push(task);
    
    // Save to localStorage
    saveTasks();
    
    // Add task to DOM
    addTaskToDOM(task);
    
    // Clear form
    e.target.reset();
    
    // Show notification
    showNotification('Task added successfully!');
}

function addTaskToDOM(task) {
    const todoList = document.querySelector('#todo .task-list');
    const inProgressList = document.querySelector('#inProgress .task-list');
    const doneList = document.querySelector('#done .task-list');
    
    const taskElement = createTaskElement(task);
    
    // Add to appropriate column based on status
    switch(task.status) {
        case 'todo':
            todoList.insertBefore(taskElement, todoList.firstChild);
            break;
        case 'inProgress':
            inProgressList.insertBefore(taskElement, inProgressList.firstChild);
            break;
        case 'done':
            doneList.insertBefore(taskElement, doneList.firstChild);
            break;
    }
}

function createTaskElement(task) {
    const div = document.createElement('div');
    div.className = `task-item priority-${task.priority}`;
    div.dataset.taskId = task.id;

    div.innerHTML = `
        <div class="task-header">
            <span class="task-title">${task.title}</span>
            <span class="task-priority">${task.priority}</span>
        </div>
        <div class="task-details">
            ${task.startDate ? `<div class="task-date">Start: ${formatDate(task.startDate)}</div>` : ''}
            ${task.dueDate ? `<div class="task-date">Due: ${formatDate(task.dueDate)}</div>` : ''}
            ${task.tags.length ? `
                <div class="task-tags">
                    ${task.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            ` : ''}
            ${task.status === 'inProgress' ? `
                <div class="progress-notes">
                    <div class="progress-header">
                        <span>Progress Notes</span>
                        <div class="progress-actions">
                            <button onclick="editProgressNotes(${task.id})" class="edit-progress-btn">
                                <span class="edit-icon">✏️</span> Edit
                            </button>
                            <button onclick="saveProgressNotes(${task.id})" class="save-progress-btn">
                                <span class="save-icon">💾</span> Save
                            </button>
                        </div>
                    </div>
                    <textarea 
                        class="progress-input" 
                        placeholder="Add your progress notes here..."
                        id="progress-${task.id}"
                        disabled
                    >${task.progressNotes || ''}</textarea>
                </div>
            ` : ''}
        </div>
        <div class="task-actions">
            <button onclick="deleteTask(${task.id})" class="delete-btn">Delete</button>
        </div>
    `;

    return div;
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleString();
}

function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    if (taskElement) {
        taskElement.remove();
    }
    showNotification('Task deleted!');
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        tasks.forEach(task => addTaskToDOM(task));
    }
}

function editProgressNotes(taskId) {
    const progressInput = document.getElementById(`progress-${taskId}`);
    progressInput.disabled = false;
    progressInput.focus();
    progressInput.classList.add('editing');
    
    // Find the edit button and toggle its state
    const editBtn = progressInput.parentElement.querySelector('.edit-progress-btn');
    editBtn.classList.add('active');
    
    showNotification('You can now edit your progress notes');
}

function saveProgressNotes(taskId) {
    const progressInput = document.getElementById(`progress-${taskId}`);
    const notes = progressInput.value;
    
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        task.progressNotes = notes;
        saveTasks();
        
        // Disable editing after save
        progressInput.disabled = true;
        progressInput.classList.remove('editing');
        
        // Reset edit button state
        const editBtn = progressInput.parentElement.querySelector('.edit-progress-btn');
        editBtn.classList.remove('active');
        
        // Show save animation
        const saveBtn = progressInput.parentElement.querySelector('.save-progress-btn');
        saveBtn.classList.add('saved');
        setTimeout(() => {
            saveBtn.classList.remove('saved');
        }, 1000);
        
        showNotification('Progress notes saved successfully!');
    }
}
