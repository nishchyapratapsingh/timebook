let timer;
let workDuration = 25;
let shortBreak = 5;
let longBreak = 15;
let sessionsBeforeLongBreak = 4;
let currentSession = 0;
let isBreak = false;

const minutesDisplay = document.getElementById('timer-minutes');
const secondsDisplay = document.getElementById('timer-seconds');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const workDurationInput = document.getElementById('work-duration');
const shortBreakInput = document.getElementById('short-break');
const longBreakInput = document.getElementById('long-break');
const sessionsBeforeLongBreakInput = document.getElementById('sessions-before-long-break');
const taskInput = document.getElementById('task-input');
const addTaskButton = document.getElementById('add-task');
const taskList = document.getElementById('task-list');
const enterButton = document.getElementById('enter');
const landingPage = document.getElementById('landing-page');
const mainContent = document.getElementById('main-content');

function updateDisplay(minutes, seconds) {
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
}

function startTimer(duration, breakTime) {
    let totalTime = duration * 60;
    let remainingTime = totalTime;

    timer = setInterval(() => {
        if (remainingTime <= 0) {
            clearInterval(timer);
            isBreak = !isBreak;
            currentSession++;
            if (isBreak) {
                remainingTime = breakTime * 60;
                if (currentSession % sessionsBeforeLongBreak === 0) {
                    remainingTime = longBreak * 60;
                }
            } else {
                remainingTime = workDuration * 60;
            }
            updateDisplay(Math.floor(remainingTime / 60), remainingTime % 60);
            playAlert();
        } else {
            remainingTime--;
            updateDisplay(Math.floor(remainingTime / 60), remainingTime % 60);
        }
    }, 1000);
}

function playAlert() {
    const audio = new Audio('alert-sound.mp3'); // Replace with your alert sound
    audio.play();
}

function startPomodoro() {
    workDuration = parseInt(workDurationInput.value) || 25;
    shortBreak = parseInt(shortBreakInput.value) || 5;
    longBreak = parseInt(longBreakInput.value) || 15;
    sessionsBeforeLongBreak = parseInt(sessionsBeforeLongBreakInput.value) || 4;

    if (!isBreak) {
        startTimer(workDuration, shortBreak);
    } else {
        startTimer(shortBreak, longBreak);
    }
}

function pauseTimer() {
    clearInterval(timer);
}

function resetTimer() {
    clearInterval(timer);
    updateDisplay(workDuration, 0);
    currentSession = 0;
    isBreak = false;
}

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText) {
        const taskItem = document.createElement('li');
        taskItem.textContent = taskText;
        taskList.appendChild(taskItem);
        taskInput.value = '';
    }
}

enterButton.addEventListener('click', () => {
    landingPage.style.display = 'none';
    mainContent.style.display = 'block';
});

startButton.addEventListener('click', startPomodoro);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
addTaskButton.addEventListener('click', addTask);
