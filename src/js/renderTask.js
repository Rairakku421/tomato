import { editTask, deleteTask } from './processingTask.js';

const renderTasks = () => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const sortedTasks = savedTasks.sort((a, b) => {
        const taskValue = { 'important': 1, 'so-so': 2, 'default': 3 };
        return taskValue[a.importance] - taskValue[b.importance];
    });

    const taskList = document.createElement('ul');
    taskList.classList.add('tasks__list');

    sortedTasks.forEach((task, index) => {
        const taskItem = document.createElement('li');
        taskItem.classList.add('tasks__item', task.importance);
        taskItem.dataset.id = task.id;

        const countNumber = document.createElement('span');
        countNumber.classList.add('count-number');
        countNumber.textContent = index + 1;

        const taskText = document.createElement('button');
        taskText.classList.add('tasks__text');
        if (task.importance === 'important') {
            taskText.classList.add('tasks__text_active');
        }
        taskText.textContent = task.text;

        const menuButton = document.createElement('button');
        menuButton.classList.add('tasks__button');

        const popup = document.createElement('div');
        popup.classList.add('popup', 'popup_active');
        popup.style.display = 'none';

        const editButton = document.createElement('button');
        editButton.classList.add('popup__button', 'popup__edit-button');
        editButton.textContent = 'Редактировать';

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('popup__button', 'popup__delete-button');
        deleteButton.textContent = 'Удалить';

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
            renderTasks();
        });

        popup.append(editButton, deleteButton);
        taskItem.append(
            countNumber,
            taskText,
            menuButton,
            popup
        );

        taskList.appendChild(taskItem);
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

    const container = document.querySelector('.tasks');
    if (container) {
        container.innerHTML = '';
        container.appendChild(taskList);
    }
};

renderTasks();

export { renderTasks }