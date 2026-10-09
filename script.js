// ============================================
// TO-DO LIST APPLICATION
// ============================================

class TodoApp {
    constructor() {
        // DOM Elements
        this.taskInput = document.getElementById('taskInput');
        this.dueDateInput = document.getElementById('dueDateInput');
        this.prioritySelect = document.getElementById('prioritySelect');
        this.submitBtn = document.getElementById('submitBtn');
        this.todoList = document.getElementById('todoList');
        this.overdueList = document.getElementById('overdueList');
        this.doneList = document.getElementById('doneList');
        this.deleteAllBtn = document.getElementById('deleteAllBtn');
        this.profileName = document.getElementById('profileName');
        this.profileTitle = document.getElementById('profileTitle');
        this.timeDisplay = document.getElementById('timeDisplay');

        // Modal Elements
        this.editProfileBtn = document.getElementById('editProfileBtn');
        this.editProfileModal = document.getElementById('editProfileModal');
        this.closeModalBtn = document.getElementById('closeModalBtn');
        this.editNameInput = document.getElementById('editNameInput');
        this.editTitleInput = document.getElementById('editTitleInput');
        this.cancelBtn = document.getElementById('cancelBtn');
        this.saveProfileBtn = document.getElementById('saveProfileBtn');

        // Data
        this.tasks = [];
        this.loadFromLocalStorage();
        this.setDefaultDate();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupProfile();
        this.setupModalListeners();
        this.updateTime();
        this.render();

        setInterval(() => this.updateTime(), 1000);        
        setInterval(() => this.render(), 60000);
    }

    setupEventListeners() {
        this.submitBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) this.addTask();
        });
        this.deleteAllBtn.addEventListener('click', () => this.deleteAllTasks());
    }

    setupProfile() {
        this.profileName.textContent = 'Nama User';
        this.profileTitle.textContent = 'Job Position';
        const savedName = localStorage.getItem('userName');
        const savedTitle = localStorage.getItem('userTitle');
        if (savedName) this.profileName.textContent = savedName;
        if (savedTitle) this.profileTitle.textContent = savedTitle;
    }

    setupModalListeners() {
        this.editProfileBtn.addEventListener('click', () => this.openEditModal());
        this.closeModalBtn.addEventListener('click', () => this.closeEditModal());
        this.cancelBtn.addEventListener('click', () => this.closeEditModal());
        this.saveProfileBtn.addEventListener('click', () => this.saveProfile());

        window.addEventListener('click', (e) => {
            if (e.target === this.editProfileModal) {
                this.closeEditModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.editProfileModal.classList.contains('active')) {
                this.closeEditModal();
            }
        });
    }

    openEditModal() {
        this.editNameInput.value = this.profileName.textContent;
        this.editTitleInput.value = this.profileTitle.textContent;
        this.editProfileModal.classList.add('active');
        setTimeout(() => this.editNameInput.focus(), 100);
    }

    closeEditModal() {
        this.editProfileModal.classList.remove('active');
    }

    saveProfile() {
        const newName = this.editNameInput.value.trim();
        const newTitle = this.editTitleInput.value.trim();

        if (!newName) {
            alert('Nama tidak boleh kosong!');
            this.editNameInput.focus();
            return;
        }

        this.profileName.textContent = newName;
        this.profileTitle.textContent = newTitle || 'Job Position';

        localStorage.setItem('userName', newName);
        localStorage.setItem('userTitle', newTitle);

        this.closeEditModal();
    }

    updateTime() {
        const now = new Date();
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                       'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        
        const dayName = days[now.getDay()];
        const date = now.getDate();
        const monthName = months[now.getMonth()];
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        this.timeDisplay.innerHTML = `
            <strong>${dayName}, ${date} ${monthName} ${year}</strong><br>
            ${hours}:${minutes}
        `;
    }

    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        this.dueDateInput.value = today;
    }

    addTask() {
        const text = this.taskInput.value.trim();
        const dueDate = this.dueDateInput.value;
        const priority = this.prioritySelect.value;

        if (!text) {
            alert('Silakan ketik tugas terlebih dahulu!');
            this.taskInput.focus();
            return;
        }

        const task = {
            id: Date.now(),
            text: text,
            dueDate: dueDate,
            priority: priority,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.push(task);
        this.saveToLocalStorage();
        this.render();

        this.taskInput.value = '';
        this.taskInput.focus();
        this.setDefaultDate();
        this.prioritySelect.value = 'medium';
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveToLocalStorage();
        this.render();
    }

    deleteAllTasks() {
        if (this.tasks.length === 0) {
            alert('Tidak ada tugas untuk dihapus!');
            return;
        }

        if (confirm('Apakah Anda yakin ingin menghapus SEMUA tugas? Tindakan ini tidak dapat dibatalkan!')) {
            this.tasks = [];
            this.saveToLocalStorage();
            this.render();
        }
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveToLocalStorage();
            this.render();
        }
    }

    isOverdue(dueDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const due = new Date(dueDate);
        due.setHours(0, 0, 0, 0);
        
        return due < today;
    }

    isToday(dateString) {
        const today = new Date().toISOString().split('T')[0];
        return dateString === today;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
                       'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
        
        const dayName = days[date.getDay()];
        const dateNum = date.getDate();
        const monthName = months[date.getMonth()];

        if (this.isToday(dateString)) {
            return `${dayName}, Hari Ini`;
        }
        return `${dayName}, ${dateNum} ${monthName}`;
    }

    createTaskElement(task) {
        const isOverdue = this.isOverdue(task.dueDate) && !task.completed;
        
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`;
        
        taskElement.innerHTML = `
            <div class="task-checkbox-wrapper">
                <button class="btn-check ${task.completed ? 'checked' : ''}" 
                        data-id="${task.id}" 
                        title="Tandai selesai">
                    ${task.completed ? '<i class="fas fa-check"></i>' : ''}
                </button>
            </div>
            <div class="task-content">
                <div class="task-text">${this.escapeHtml(task.text)}</div>
                <div class="task-meta">
                    <div class="task-date">
                        <i class="fas fa-calendar"></i>
                        <span>${this.formatDate(task.dueDate)}</span>
                    </div>
                    <span class="priority-badge ${task.priority}">${task.priority}</span>
                    ${isOverdue ? '<span class="priority-badge overdue"><i class="fas fa-exclamation"></i> OVERDUE</span>' : ''}
                </div>
            </div>
            <div class="task-actions">
                <button class="btn-delete" data-id="${task.id}" title="Hapus tugas">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        taskElement.querySelector('.btn-check').addEventListener('click', () => {
            this.toggleTask(task.id);
        });

        taskElement.querySelector('.btn-delete').addEventListener('click', () => {
            if (confirm('Hapus tugas ini?')) {
                this.deleteTask(task.id);
            }
        });

        return taskElement;
    }

    render() {
        const activeTasks = this.tasks.filter(t => !t.completed);
        const completedTasks = this.tasks.filter(t => t.completed);
        
        const overdueTasks = activeTasks.filter(t => this.isOverdue(t.dueDate));
        const regularActiveTasks = activeTasks.filter(t => !this.isOverdue(t.dueDate));

        this.renderSection(this.todoList, regularActiveTasks);
        document.getElementById('todoCount').textContent = regularActiveTasks.length;

        this.renderSection(this.overdueList, overdueTasks);
        document.getElementById('overdueCount').textContent = overdueTasks.length;

        this.renderSection(this.doneList, completedTasks);
        document.getElementById('doneCount').textContent = completedTasks.length;
    }

    renderSection(container, tasks) {
        container.innerHTML = '';

        if (tasks.length === 0) {
            let emptyMessage = 'Tidak ada tugas';
            let emptyIcon = 'fa-inbox';

            if (container.id === 'overdueList') {
                emptyMessage = 'Tidak ada tugas terlambat';
                emptyIcon = 'fa-check-circle';
            } else if (container.id === 'doneList') {
                emptyMessage = 'Belum ada tugas yang selesai';
                emptyIcon = 'fa-smile';
            }

            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas ${emptyIcon}"></i>
                    <p>${emptyMessage}</p>
                </div>
            `;
            return;
        }

        tasks.forEach(task => {
            container.appendChild(this.createTaskElement(task));
        });
    }

    saveToLocalStorage() {
        localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
    }

    loadFromLocalStorage() {
        const saved = localStorage.getItem('todoTasks');
        if (saved) {
            try {
                this.tasks = JSON.parse(saved);
            } catch (e) {
                console.error('Error loading tasks:', e);
                this.tasks = [];
            }
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});