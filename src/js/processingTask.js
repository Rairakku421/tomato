import { renderTasks, savedTasks } from './renderTask.js';

const inputTask = document.querySelector('.task-name');
const inputTaskImportance = document.querySelector('.button-importance');
const addTaskBtn = document.querySelector('.task-form__add-button');

let taskImportance = 'default';

inputTaskImportance.addEventListener('click', () => {
    inputTaskImportance.classList.remove(taskImportance);

    if (taskImportance === 'default') {
        taskImportance = 'so-so';
    } else if (taskImportance === 'so-so') {
        taskImportance = 'important';
    } else {
        taskImportance = 'default';
    }

    inputTaskImportance.classList.add(taskImportance);
});

addTaskBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (inputTask.value.trim() !== '') {
        createTask(taskImportance);
        inputTask.value = '';
    }
});

const createTask = (taskImportance) => {
    const taskName = inputTask.value;
    const task = {
        text: taskName,
        importance: taskImportance,
        id: Date.now(),
        selected: false
    };
    savedTasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(savedTasks));
    renderTasks();
};

const editTask = (id) => {
    const task = savedTasks.find(t => t.id === id);
    if (!task) return;
    const taskItem = document.querySelector(`[data-id="${id}"]`);
    const taskTextBtn = taskItem.querySelector('.tasks__text');
    const originalText = taskTextBtn.textContent;
    let currentImportance = task.importance;

    const editContainer = document.createElement('div');
    editContainer.classList.add('edit__container');
    const input = document.createElement('input');
    input.type = 'text';
    input.value = originalText;
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'ок';

    editContainer.appendChild(input);
    editContainer.appendChild(saveBtn);
    taskTextBtn.replaceWith(editContainer);
    input.focus();

    const changeImportance = () => {
        if (currentImportance === 'default') {
            currentImportance = 'so-so';
        } else if (currentImportance === 'so-so') {
            currentImportance = 'important';
        } else {
            currentImportance = 'default';
        }
        taskItem.classList.remove('default', 'so-so', 'important');
        taskItem.classList.add(currentImportance);
    };

    const importanceClickHandler = (e) => {
        if (!e.target.closest('.edit__container')) {
            changeImportance();
        }
    };

    taskItem.addEventListener('click', importanceClickHandler);

    const saveHandler = () => {
        const newText = input.value.trim();
        const newBtn = document.createElement('button');
        newBtn.className = 'tasks__text';
        if (task.selected) {
            newBtn.classList.add('tasks__text_active');
        }
        newBtn.textContent = newText || originalText;
        editContainer.replaceWith(newBtn);

        let hasChanges = false;

        if (newText && newText !== originalText) {
            task.text = newText;
            hasChanges = true;
        }

        if (currentImportance !== task.importance) {
            task.importance = currentImportance;
            hasChanges = true;
        }

        if (hasChanges) {
            localStorage.setItem('tasks', JSON.stringify(savedTasks));
            renderTasks();
        }

        taskItem.removeEventListener('click', importanceClickHandler);
    };

    saveBtn.addEventListener('click', saveHandler);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') saveHandler();
    });
};

const deleteTask = (id) => {
    savedTasks.splice(0, savedTasks.length, ...savedTasks.filter(task => task.id !== id));
    localStorage.setItem('tasks', JSON.stringify(savedTasks));
    renderTasks();
};

const selectedTask = (id, index) => {
    const windowPanelTitle = document.querySelector('.window__panel-title');
    const windowPanelTaskText = document.querySelector('.window__panel-task-text');

    if (id === null && index === null) {
        windowPanelTitle.textContent = '⁣';
        windowPanelTaskText.textContent = '⁣';
    }

    savedTasks.forEach(task => {
        task.selected = task.id === id;
    });

    const taskToSelect = savedTasks.find(task => task.id === id);
    if (taskToSelect) {
        windowPanelTitle.textContent = taskToSelect.text;
        windowPanelTaskText.textContent = 'Tomato ' + index;
    }

    localStorage.setItem('tasks', JSON.stringify(savedTasks));
    renderTasks();
};

export { editTask, deleteTask, selectedTask };