import { editTask, deleteTask, selectedTask } from './processingTask.js';

export let savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
    const selectedTaskId = savedTasks.find(task => task.selected)?.id;
    if (selectedTaskId) {
        const sortedTasks = [...savedTasks].sort((a, b) => {
            const taskValue = { 'important': 1, 'so-so': 2, 'default': 3 };
            return taskValue[a.importance] - taskValue[b.importance];
        });
        const sortedIndex = sortedTasks.findIndex(task => task.id === selectedTaskId);
        if (sortedIndex !== -1) {
            selectedTask(selectedTaskId, sortedIndex + 1);
        }
    }
});

export const renderTasks = () => {
    const sortedTasks = [...savedTasks].sort((a, b) => {
        const taskValue = { 'important': 1, 'so-so': 2, 'default': 3 };
        return taskValue[a.importance] - taskValue[b.importance];
    });

    const container = document.querySelector('.tasks__list');
    if (container) {
        container.innerHTML = '';
    }

    sortedTasks.forEach((task, index) => {
        const taskItem = document.createElement('li');
        taskItem.classList.add('tasks__item', task.importance);
        taskItem.dataset.id = task.id;

        const countNumber = document.createElement('span');
        countNumber.classList.add('count-number');
        countNumber.textContent = index + 1;

        const taskText = document.createElement('button');
        taskText.classList.add('tasks__text');
        if (task.selected) {
            taskText.classList.add('tasks__text_active');
        }
        taskText.textContent = task.text;

        taskText.addEventListener('click', (e) => {
            e.stopPropagation();
            if (task.selected) {
                const updatedTasks = savedTasks.map(t => ({
                    ...t,
                    selected: false
                }));
                localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                savedTasks.splice(0, savedTasks.length, ...updatedTasks);
                selectedTask(null, null);
            } else {
                selectedTask(task.id, index + 1);
            }
        });

        const menuButton = document.createElement('button');
        menuButton.classList.add('tasks__button');

        const popup = document.createElement('div');
        popup.classList.add('popup', 'popup_active');
        popup.style.display = 'none';

        const editButton = document.createElement('button');
        editButton.classList.add('popup__button', 'popup__edit-button');
        editButton.textContent = 'Edit';

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('popup__button', 'popup__delete-button');
        deleteButton.textContent = 'Delete';

        menuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            popup.style.display = popup.style.display === 'none' ? 'flex' : 'none';
        });

        editButton.addEventListener('click', (e) => {
            e.stopPropagation();
            editTask(task.id);
        });

        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteTask(task.id);
        });

        popup.append(editButton, deleteButton);
        taskItem.append(countNumber, taskText, menuButton, popup);
        container.appendChild(taskItem);
    });

    document.addEventListener('click', () => {
        document.querySelectorAll('.popup').forEach(popup => {
            popup.style.display = 'none';
        });
    });

    document.querySelectorAll('.popup').forEach(popup => {
        popup.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });

};
