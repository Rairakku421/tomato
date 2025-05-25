import {renderTasks} from './renderTask.js'

const inputTask = document.querySelector('.task-name');
const inputTaskImportance = document.querySelector('.button-importance');
const addTaskBtn = document.querySelector('.task-form__add-button');

let taskImportance = 'default';

inputTaskImportance.addEventListener('click', () => {
    inputTaskImportance.classList.remove(taskImportance);

    if (taskImportance === 'default') {
        taskImportance = 'so-so';
    }
    else if (taskImportance === 'so-so') {
        taskImportance = 'important';
    }
    else {
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
})

const createTask = (taskImportance) => {
    const taskName = inputTask.value;
    const task = {
        text: taskName,
        importance: taskImportance,
        id: Date.now()
    };
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
};

const editTask = (id) => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const taskItem = document.querySelector(`[data-id="${id}"]`);
    const taskTextBtn = taskItem.querySelector('.tasks__text');
    const originalText = taskTextBtn.textContent;

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

    const saveHandler = () => {
        const newText = input.value.trim();

        const newBtn = document.createElement('button');
        newBtn.className = 'tasks__text';
        if (task.importance === 'important') {
            newBtn.classList.add('tasks__text_active');
        }
        newBtn.textContent = newText || originalText;

        editContainer.replaceWith(newBtn);

        if (newText && newText !== originalText) {
            task.text = newText;
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    };

    saveBtn.addEventListener('click', saveHandler);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') saveHandler();
    });
};

const deleteTask = (id) => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const tasksUpdate = tasks.filter(tasks => tasks.id !== id)
    localStorage.setItem('tasks', JSON.stringify(tasksUpdate))
}

export { editTask, deleteTask}