import tomatoBell from '../sound/tomato-bell.mp3';

const timeText = document.querySelector('.window__timer-text');
const startBtn = document.querySelector('.button-primary');
const stopBtn = document.querySelector('.button-secondary');
const restartBtn = document.querySelector('.button-restart');
const breakTimeText = document.querySelector('.break-time');

let endTime;
let iteration = 0;
let timerInterval;
let remainingTime = 0;

const audio = new Audio(tomatoBell)

const updateTimer = () => {
    const now = new Date().getTime();
    const timeLeft = endTime - now;

    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        audio.play();
        timeText.textContent = '00:00';
        breakTime(iteration);
        return;
    }

    const minutes = Math.floor(timeLeft / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    timeText.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

startBtn.addEventListener('click', () => {
    startBtn.classList.add('hidden');
    stopBtn.classList.remove('hidden');
    restartBtn.classList.add('hidden');
    breakTimeText.classList.add('hidden');

    endTime = new Date().getTime() + (remainingTime || 25 * 60000);
    timerInterval = setInterval(updateTimer, 1000);
    updateTimer();
});

stopBtn.addEventListener('click', () => {
    if (!endTime) return;

    const now = new Date().getTime();
    remainingTime = endTime - now;
    clearInterval(timerInterval);

    startBtn.textContent = 'Продолжить';
    startBtn.classList.remove('hidden');
    stopBtn.classList.add('hidden');
    restartBtn.classList.remove('hidden');
});

restartBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    remainingTime = 0;
    iteration = 0;
    timeText.textContent = '25:00';
    startBtn.textContent = 'Старт';
    startBtn.classList.remove('hidden');
    stopBtn.classList.add('hidden');
    restartBtn.classList.add('hidden');
    breakTimeText.classList.add('hidden');
});

const breakTime = (iter) => {
    startBtn.classList.add('hidden');
    stopBtn.classList.add('hidden');
    restartBtn.classList.add('hidden');
    breakTimeText.classList.remove('hidden');

    const breakDuration = (iter % 5 !== 0) ? 5 * 60000 : 20 * 60000;
    let endBreakTime = new Date().getTime() + breakDuration;

    timerInterval = setInterval(() => {
        const now = new Date().getTime();
        const timeDifference = endBreakTime - now;

        if (timeDifference <= 0) {
            clearInterval(timerInterval);
            timeText.textContent = '25:00';
            startBtn.classList.remove('hidden');
            stopBtn.classList.add('hidden');
            breakTimeText.classList.add('hidden');

            iteration = (iteration % 5) + 1;
            return;
        }

        const remainingMinutes = Math.floor(timeDifference / (1000 * 60));
        const remainingSeconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
        timeText.textContent =
            `${remainingMinutes < 10 ? '0' : ''}${remainingMinutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }, 1000);
};