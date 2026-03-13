// Productivity Dashboard Application

// StorageManager - Centralized interface for Local Storage operations
class StorageManager {
    constructor() {
        this.TASKS_KEY = 'productivity-dashboard-tasks';
        this.LINKS_KEY = 'productivity-dashboard-links';
        this.THEME_KEY = 'productivity-dashboard-theme';
        this.NAME_KEY = 'productivity-dashboard-name';
        this.TIMER_DURATION_KEY = 'productivity-dashboard-timer-duration';
    }

    /**
     * Retrieve tasks array from Local Storage
     * @returns {Array} Array of task objects, or empty array if none exist or on error
     */
    getTasks() {
        try {
            const data = localStorage.getItem(this.TASKS_KEY);
            if (!data) {
                return [];
            }
            const tasks = JSON.parse(data);
            return Array.isArray(tasks) ? tasks : [];
        } catch (error) {
            console.error('Error parsing tasks from storage:', error);
            return [];
        }
    }

    /**
     * Save tasks array to Local Storage
     * @param {Array} tasks - Array of task objects to save
     */
    saveTasks(tasks) {
        try {
            const data = JSON.stringify(tasks);
            localStorage.setItem(this.TASKS_KEY, data);
        } catch (error) {
            console.error('Error saving tasks to storage:', error);
        }
    }

    /**
     * Retrieve links array from Local Storage
     * @returns {Array} Array of link objects, or empty array if none exist or on error
     */
    getLinks() {
        try {
            const data = localStorage.getItem(this.LINKS_KEY);
            if (!data) {
                return [];
            }
            const links = JSON.parse(data);
            return Array.isArray(links) ? links : [];
        } catch (error) {
            console.error('Error parsing links from storage:', error);
            return [];
        }
    }

    /**
     * Save links array to Local Storage
     * @param {Array} links - Array of link objects to save
     */
    saveLinks(links) {
        try {
            const data = JSON.stringify(links);
            localStorage.setItem(this.LINKS_KEY, data);
        } catch (error) {
            console.error('Error saving links to storage:', error);
        }
    }

    /**
     * Get timer duration from Local Storage
     * @returns {number} Timer duration in seconds, or null if not set
     */
    getTimerDuration() {
        try {
            const duration = localStorage.getItem(this.TIMER_DURATION_KEY);
            return duration ? parseInt(duration) : null;
        } catch (error) {
            console.error('Error getting timer duration from storage:', error);
            return null;
        }
    }

    /**
     * Save timer duration to Local Storage
     * @param {number} seconds - Timer duration in seconds
     */
    saveTimerDuration(seconds) {
        try {
            localStorage.setItem(this.TIMER_DURATION_KEY, seconds.toString());
        } catch (error) {
            console.error('Error saving timer duration to storage:', error);
        }
    }

    /**
     * Get theme preference from Local Storage
     * @returns {string} Theme preference ('pink' or 'blue')
     */
    getTheme() {
        try {
            return localStorage.getItem(this.THEME_KEY) || 'pink';
        } catch (error) {
            console.error('Error getting theme from storage:', error);
            return 'pink';
        }
    }

    /**
     * Save theme preference to Local Storage
     * @param {string} theme - Theme preference ('pink' or 'blue')
     */
    saveTheme(theme) {
        try {
            localStorage.setItem(this.THEME_KEY, theme);
        } catch (error) {
            console.error('Error saving theme to storage:', error);
        }
    }

    /**
     * Get user name from Local Storage
     * @returns {string} User name or empty string
     */
    getName() {
        try {
            return localStorage.getItem(this.NAME_KEY) || '';
        } catch (error) {
            console.error('Error getting name from storage:', error);
            return '';
        }
    }

    /**
     * Save user name to Local Storage
     * @param {string} name - User name
     */
    saveName(name) {
        try {
            localStorage.setItem(this.NAME_KEY, name);
        } catch (error) {
            console.error('Error saving name to storage:', error);
        }
    }

    /**
     * Clear all application data from Local Storage (for testing)
     */
    clear() {
        try {
            localStorage.removeItem(this.TASKS_KEY);
            localStorage.removeItem(this.LINKS_KEY);
            localStorage.removeItem(this.THEME_KEY);
            localStorage.removeItem(this.NAME_KEY);
        } catch (error) {
            console.error('Error clearing storage:', error);
        }
    }
}

// GreetingComponent - Manages time, date, and greeting display
class GreetingComponent {
    /**
     * Initialize the greeting component
     * @param {HTMLElement} containerElement - The container element for the greeting section
     * @param {StorageManager} storageManager - Storage manager instance
     */
    constructor(containerElement, storageManager) {
        this.container = containerElement;
        this.storageManager = storageManager;
        this.intervalId = null;
        this.userName = '';
    }

    /**
     * Start the 1-second update interval
     */
    init() {
        // Load user name from storage
        this.userName = this.storageManager.getName();
        
        // Initial display update
        this.updateDisplay();
        
        // Start interval to update every second
        this.intervalId = setInterval(() => {
            this.updateDisplay();
        }, 1000);
    }

    /**
     * Set user name and update display
     * @param {string} name - User name
     */
    setUserName(name) {
        this.userName = name;
        this.storageManager.saveName(name);
        this.updateDisplay();
    }

    /**
     * Update the time, date, and greeting display
     */
    updateDisplay() {
        const now = new Date();
        
        // Update time display
        const timeElement = this.container.querySelector('.time-display');
        if (timeElement) {
            timeElement.textContent = this.formatTime(now);
        }
        
        // Update date display
        const dateElement = this.container.querySelector('.date-display');
        if (dateElement) {
            dateElement.textContent = this.formatDate(now);
        }
        
        // Update greeting text
        const greetingElement = this.container.querySelector('.greeting-text');
        if (greetingElement) {
            greetingElement.textContent = this.getGreeting(now.getHours());
        }
    }

    /**
     * Get appropriate greeting based on hour of day
     * @param {number} hour - Hour in 24-hour format (0-23)
     * @returns {string} Greeting text
     */
    getGreeting(hour) {
        let greeting = '';
        if (hour >= 5 && hour <= 11) {
            greeting = 'Good morning';
        } else if (hour >= 12 && hour <= 16) {
            greeting = 'Good afternoon';
        } else {
            greeting = 'Good evening';
        }
        
        // Add user name if set
        if (this.userName) {
            greeting += `, ${this.userName}`;
        }
        
        return greeting;
    }

    /**
     * Format time as "HH:MM:SS AM/PM"
     * @param {Date} date - Date object to format
     * @returns {string} Formatted time string
     */
    formatTime(date) {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        // Convert to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // 0 should be 12
        
        // Pad with zeros
        const hoursStr = String(hours).padStart(2, '0');
        const minutesStr = String(minutes).padStart(2, '0');
        const secondsStr = String(seconds).padStart(2, '0');
        
        return `${hoursStr}:${minutesStr}:${secondsStr} ${ampm}`;
    }

    /**
     * Format date as "Day, Month Date"
     * @param {Date} date - Date object to format
     * @returns {string} Formatted date string
     */
    formatDate(date) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
        
        const dayName = days[date.getDay()];
        const monthName = months[date.getMonth()];
        const dayNumber = date.getDate();
        
        return `${dayName}, ${monthName} ${dayNumber}`;
    }

    /**
     * Clean up the interval timer
     */
    destroy() {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}

// TimerComponent - Manages countdown timer with customizable duration
class TimerComponent {
    /**
     * Initialize the timer component
     * @param {HTMLElement} containerElement - The container element for the timer section
     * @param {StorageManager} storageManager - Storage manager instance
     */
    constructor(containerElement, storageManager) {
        this.container = containerElement;
        this.storageManager = storageManager;
        this.defaultSeconds = 1500; // 25 minutes default
        this.seconds = this.defaultSeconds;
        this.intervalId = null;
        this.isRunning = false;
    }

    /**
     * Set up button event listeners
     */
    init() {
        // Load custom timer duration from storage
        const savedDuration = this.storageManager.getTimerDuration();
        if (savedDuration) {
            this.defaultSeconds = savedDuration;
            this.seconds = savedDuration;
        }

        const startButton = document.getElementById('timer-start');
        const stopButton = document.getElementById('timer-stop');
        const resetButton = document.getElementById('timer-reset');
        const settingsButton = document.getElementById('timer-settings');

        if (startButton) {
            startButton.addEventListener('click', () => this.start());
        }
        if (stopButton) {
            stopButton.addEventListener('click', () => this.stop());
        }
        if (resetButton) {
            resetButton.addEventListener('click', () => this.reset());
        }
        if (settingsButton) {
            settingsButton.addEventListener('click', () => this.openSettings());
        }

        // Initial display update
        this.updateDisplay();
    }

    /**
     * Open settings dialog to change timer duration
     */
    openSettings() {
        const currentMinutes = Math.floor(this.defaultSeconds / 60);
        const input = prompt(`Set timer duration (in minutes):\nCurrent: ${currentMinutes} minutes`, currentMinutes);
        
        if (input !== null && input.trim() !== '') {
            const minutes = parseInt(input);
            if (!isNaN(minutes) && minutes > 0 && minutes <= 999) {
                this.defaultSeconds = minutes * 60;
                this.storageManager.saveTimerDuration(this.defaultSeconds);
                this.reset();
                alert(`Timer set to ${minutes} minutes!`);
            } else {
                alert('Please enter a valid number between 1 and 999 minutes.');
            }
        }
    }

    /**
     * Begin countdown with setInterval
     */
    start() {
        if (this.isRunning) {
            return; // Already running
        }

        this.isRunning = true;
        this.intervalId = setInterval(() => {
            this.tick();
        }, 1000);
    }

    /**
     * Pause countdown and clear interval
     */
    stop() {
        if (!this.isRunning) {
            return; // Not running
        }

        this.isRunning = false;
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    /**
     * Return to default seconds and update display
     */
    reset() {
        this.stop();
        this.seconds = this.defaultSeconds;
        this.updateDisplay();
    }

    /**
     * Decrement seconds and call updateDisplay()
     */
    tick() {
        if (this.seconds > 0) {
            this.seconds--;
            this.updateDisplay();

            if (this.seconds === 0) {
                this.stop();
                this.onComplete();
            }
        }
    }

    /**
     * Render current time in MM:SS format
     */
    updateDisplay() {
        const displayElement = this.container.querySelector('.timer-display');
        if (displayElement) {
            displayElement.textContent = this.formatTime(this.seconds);
        }
    }

    /**
     * Convert seconds to "MM:SS" format
     * @param {number} seconds - Total seconds to format
     * @returns {string} Formatted time string
     */
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        const minutesStr = String(minutes).padStart(2, '0');
        const secondsStr = String(remainingSeconds).padStart(2, '0');
        
        return `${minutesStr}:${secondsStr}`;
    }

    /**
     * Handle timer reaching zero (alert notification)
     */
    onComplete() {
        alert('Timer complete! Time for a break.');
    }
}

// TaskListComponent - Manages task list with CRUD operations
class TaskListComponent {
    /**
     * Initialize the task list component
     * @param {HTMLElement} containerElement - The container element for the task section
     * @param {StorageManager} storageManager - Storage manager instance for persistence
     */
    constructor(containerElement, storageManager) {
        this.container = containerElement;
        this.storageManager = storageManager;
        this.tasks = [];
    }

    /**
     * Load tasks from storage and set up event listeners
     */
    init() {
        // Load tasks from storage
        this.tasks = this.storageManager.getTasks();
        
        // Set up event listeners
        const taskForm = document.getElementById('task-form');
        if (taskForm) {
            taskForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddTask();
            });
        }

        // Initial render
        this.renderTasks();
    }

    /**
     * Handle add task form submission
     */
    handleAddTask() {
        const taskInput = document.getElementById('task-input');
        if (taskInput) {
            const text = taskInput.value.trim();
            if (text) {
                this.addTask(text);
                taskInput.value = '';
            }
        }
    }

    /**
     * Add a new task to the list
     * @param {string} text - Task description
     */
    addTask(text) {
        // Validate text is non-empty and non-whitespace
        if (!text || text.trim().length === 0) {
            return;
        }

        const trimmedText = text.trim();

        // Check for duplicate task (case-insensitive)
        const isDuplicate = this.tasks.some(task => 
            task.text.toLowerCase() === trimmedText.toLowerCase()
        );

        if (isDuplicate) {
            alert('This task already exists!');
            return;
        }

        // Create new task object
        const task = {
            id: this.generateTaskId(),
            text: trimmedText,
            completed: false,
            createdAt: Date.now()
        };

        // Add to array
        this.tasks.push(task);

        // Save to storage
        this.saveToStorage();

        // Update display
        this.renderTasks();
    }

    /**
     * Edit a task's text
     * @param {string} id - Task ID to edit
     * @param {string} newText - New task text
     */
    editTask(id, newText) {
        // Validate new text
        if (!newText || newText.trim().length === 0) {
            return;
        }

        // Find and update task
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.text = newText.trim();
            this.saveToStorage();
            this.renderTasks();
        }
    }

    /**
     * Delete a task from the list
     * @param {string} id - Task ID to delete
     */
    deleteTask(id) {
        // Remove from array
        this.tasks = this.tasks.filter(task => task.id !== id);

        // Save to storage
        this.saveToStorage();

        // Update display
        this.renderTasks();
    }

    /**
     * Toggle task completion status
     * @param {string} id - Task ID to toggle
     */
    toggleComplete(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveToStorage();
            this.renderTasks();
        }
    }

    /**
     * Render the task list to the DOM
     */
    renderTasks() {
        const taskList = document.getElementById('task-list');
        const emptyMessage = this.container.querySelector('.empty-message');
        
        if (!taskList) {
            return;
        }

        // Clear current content
        taskList.innerHTML = '';

        // Show/hide empty message
        if (emptyMessage) {
            emptyMessage.style.display = this.tasks.length === 0 ? 'block' : 'none';
        }

        // Render each task
        this.tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = 'task-item';
            if (task.completed) {
                taskItem.classList.add('completed');
            }
            taskItem.dataset.id = task.id;

            // Checkbox
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'task-checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => this.toggleComplete(task.id));

            // Task text
            const taskText = document.createElement('span');
            taskText.className = 'task-text';
            taskText.textContent = task.text;

            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'task-delete';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => this.deleteTask(task.id));

            taskItem.appendChild(checkbox);
            taskItem.appendChild(taskText);
            taskItem.appendChild(deleteBtn);
            taskList.appendChild(taskItem);
        });
    }

    /**
     * Save tasks to storage
     */
    saveToStorage() {
        this.storageManager.saveTasks(this.tasks);
    }

    /**
     * Generate a unique task ID
     * @returns {string} Unique identifier
     */
    generateTaskId() {
        return `task-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    }
}

// QuickLinksComponent - Manages quick links list
class QuickLinksComponent {
    /**
     * Initialize the quick links component
     * @param {HTMLElement} containerElement - The container element for the quick links section
     * @param {StorageManager} storageManager - Storage manager instance for persistence
     */
    constructor(containerElement, storageManager) {
        this.container = containerElement;
        this.storageManager = storageManager;
        this.links = [];
    }

    /**
     * Load links from storage and set up event listeners
     */
    init() {
        // Load links from storage
        this.links = this.storageManager.getLinks();
        
        // Set up event listeners
        const addButton = document.getElementById('add-link-btn');
        if (addButton) {
            addButton.addEventListener('click', () => this.handleAddLink());
        }

        // Initial render
        this.renderLinks();
    }

    /**
     * Handle add link button click
     */
    handleAddLink() {
        const nameInput = document.getElementById('link-name-input');
        const urlInput = document.getElementById('link-url-input');

        if (nameInput && urlInput) {
            const name = nameInput.value.trim();
            const url = urlInput.value.trim();

            if (name && url) {
                this.addLink(name, url);
                // Clear inputs
                nameInput.value = '';
                urlInput.value = '';
            }
        }
    }

    /**
     * Add a new link to the list
     * @param {string} name - Link name/title
     * @param {string} url - Link URL
     */
    addLink(name, url) {
        // Validate name and URL are non-empty
        if (!name || !url) {
            return;
        }

        // Validate and fix URL
        const validatedUrl = this.validateUrl(url);

        // Create new link object
        const link = {
            id: this.generateLinkId(),
            name: name,
            url: validatedUrl,
            createdAt: new Date().toISOString()
        };

        // Add to array
        this.links.push(link);

        // Save to storage
        this.saveToStorage();

        // Update display
        this.renderLinks();
    }

    /**
     * Delete a link from the list
     * @param {string} id - Link ID to delete
     */
    deleteLink(id) {
        // Remove from array
        this.links = this.links.filter(link => link.id !== id);

        // Save to storage
        this.saveToStorage();

        // Update display
        this.renderLinks();
    }

    /**
     * Open a link in a new tab
     * @param {string} url - URL to open
     */
    openLink(url) {
        window.open(url, '_blank');
    }

    /**
     * Render the links list to the DOM
     */
    renderLinks() {
        const listElement = this.container.querySelector('.links-list');
        if (!listElement) {
            return;
        }

        // Clear current content
        listElement.innerHTML = '';

        // Display empty state message if no links
        if (this.links.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.className = 'empty-state';
            emptyMessage.textContent = 'No quick links yet. Add one above!';
            listElement.appendChild(emptyMessage);
            return;
        }

        // Render each link
        this.links.forEach(link => {
            const linkItem = document.createElement('div');
            linkItem.className = 'link-item';

            // Link name (clickable)
            const linkName = document.createElement('span');
            linkName.className = 'link-name';
            linkName.textContent = link.name;
            linkName.style.cursor = 'pointer';
            linkName.addEventListener('click', () => this.openLink(link.url));

            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-link-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => this.deleteLink(link.id));

            linkItem.appendChild(linkName);
            linkItem.appendChild(deleteBtn);
            listElement.appendChild(linkItem);
        });
    }

    /**
     * Save links to storage
     */
    saveToStorage() {
        this.storageManager.saveLinks(this.links);
    }

    /**
     * Generate a unique link ID
     * @returns {string} Unique identifier
     */
    generateLinkId() {
        return `link-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    }

    /**
     * Validate URL and ensure it has a protocol
     * @param {string} url - URL to validate
     * @returns {string} Validated URL with protocol
     */
    validateUrl(url) {
        // Check if URL already has a protocol
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        // Prepend https:// if missing
        return `https://${url}`;
    }
}

/**
 * Initialize the application when DOM is ready
 * Sets up all components with proper error handling
 */
function initializeApp() {
    console.log('Productivity Dashboard initializing...');
    
    // Initialize StorageManager
    const storageManager = new StorageManager();
    
    // Initialize theme
    const savedTheme = storageManager.getTheme();
    if (savedTheme === 'blue') {
        document.body.classList.add('blue-theme');
    }
    
    // Initialize GreetingComponent
    const greetingSection = document.getElementById('greeting-section');
    let greetingComponent = null;
    if (greetingSection) {
        greetingComponent = new GreetingComponent(greetingSection, storageManager);
        greetingComponent.init();
        console.log('GreetingComponent initialized');
    } else {
        console.error('Failed to initialize GreetingComponent: Element with id "greeting-section" not found');
    }
    
    // Set up theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('blue-theme');
            const isBlue = document.body.classList.contains('blue-theme');
            storageManager.saveTheme(isBlue ? 'blue' : 'pink');
            
            // Update icon
            const icon = themeToggle.querySelector('.theme-icon');
            if (icon) {
                icon.textContent = isBlue ? '💖' : '💙';
            }
        });
        
        // Set initial icon
        const icon = themeToggle.querySelector('.theme-icon');
        if (icon) {
            icon.textContent = savedTheme === 'blue' ? '💖' : '💙';
        }
    }
    
    // Set up name settings
    const nameSettings = document.getElementById('name-settings');
    if (nameSettings && greetingComponent) {
        nameSettings.addEventListener('click', () => {
            const currentName = storageManager.getName();
            const newName = prompt('Enter your name:', currentName);
            if (newName !== null) {
                greetingComponent.setUserName(newName.trim());
            }
        });
    }
    
    // Initialize TimerComponent
    const timerSection = document.getElementById('timer-section');
    if (timerSection) {
        const timerComponent = new TimerComponent(timerSection, storageManager);
        timerComponent.init();
        console.log('TimerComponent initialized');
    } else {
        console.error('Failed to initialize TimerComponent: Element with id "timer-section" not found');
    }
    
    // Initialize TaskListComponent
    const taskSection = document.getElementById('task-section');
    if (taskSection) {
        const taskListComponent = new TaskListComponent(taskSection, storageManager);
        taskListComponent.init();
        console.log('TaskListComponent initialized');
    } else {
        console.error('Failed to initialize TaskListComponent: Element with id "task-section" not found');
    }
    
    // Initialize QuickLinksComponent
    const quickLinksSection = document.getElementById('quick-links-section');
    if (quickLinksSection) {
        const quickLinksComponent = new QuickLinksComponent(quickLinksSection, storageManager);
        quickLinksComponent.init();
        console.log('QuickLinksComponent initialized');
    } else {
        console.error('Failed to initialize QuickLinksComponent: Element with id "quick-links-section" not found');
    }
    
    console.log('Productivity Dashboard initialization complete');
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Export components for testing (Node.js/CommonJS)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        StorageManager,
        GreetingComponent,
        TimerComponent,
        TaskListComponent,
        QuickLinksComponent
    };
}
