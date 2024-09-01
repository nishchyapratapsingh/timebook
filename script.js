// Pomodoro Timer Variables
let timerInterval;
let isPaused = false;
let currentTimer = 25 * 60; // Initial work timer set to 25 minutes
let sessionCount = 0; // Count of completed work sessions
let isBreakTime = false;
const alertSound = document.getElementById('alert-sound');
const clickSound = document.getElementById('click-sound');
const deleteSound = document.getElementById('delete-sound');

function updateTimerDisplay() {
    const minutes = Math.floor(currentTimer / 60);
    const seconds = currentTimer % 60;
    document.getElementById('timer').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function playAlertSound() {
    alertSound.play();
}

function playClickSound() {
    clickSound.play();
}

function playDeleteSound() {
    deleteSound.play();
}

function startPomodoro() {
    if (!timerInterval) {
        playClickSound();
        timerInterval = setInterval(() => {
            if (currentTimer > 0) {
                currentTimer--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                timerInterval = null;

                if (isBreakTime) {
                    playAlertSound();
                    alert("Break time is over! Time to get back to work.");
                    isBreakTime = false;
                    startNextSession();
                } else {
                    sessionCount++;
                    playAlertSound();
                    alert("Pomodoro session complete!");

                    if (sessionCount % 4 === 0) {
                        startLongBreak();
                    } else {
                        startShortBreak();
                    }
                }
            }
        }, 1000);
    }
}

function pausePomodoro() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        isPaused = true;
        playClickSound();
    }
}

function resetPomodoro() {
    clearInterval(timerInterval);
    timerInterval = null;
    isPaused = false;
    sessionCount = 0;
    isBreakTime = false;
    currentTimer = 25 * 60; // Reset to 25 minutes
    updateTimerDisplay();
    playClickSound();
}

function startNextSession() {
    currentTimer = 25 * 60;
    updateTimerDisplay();
    startPomodoro();
}

function startShortBreak() {
    isBreakTime = true;
    currentTimer = 5 * 60; // 5-minute short break
    updateTimerDisplay();
    startPomodoro();
}

function startLongBreak() {
    isBreakTime = true;
    currentTimer = 15 * 60; // 15-minute long break
    updateTimerDisplay();
    startPomodoro();
}

document.getElementById('start').addEventListener('click', startPomodoro);
document.getElementById('pause').addEventListener('click', pausePomodoro);
document.getElementById('reset').addEventListener('click', resetPomodoro);


// To-Do List Variables and Functions
const taskInput = document.getElementById('todo-input');
const addTaskButton = document.getElementById('add-task');
const taskList = document.getElementById('todo-list');

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText) {
        const taskItem = document.createElement('li');
        taskItem.textContent = taskText;

        // Create "Mark as Done" button
        const doneButton = document.createElement('button');
        doneButton.textContent = 'Mark as Done';
        doneButton.style.marginLeft = '10px';
        doneButton.style.backgroundColor = '#4CAF50';
        doneButton.style.color = '#ECDFCC';
        doneButton.style.border = 'none';
        doneButton.style.padding = '5px 10px';
        doneButton.style.cursor = 'pointer';
        doneButton.style.borderRadius = '5px';
        doneButton.addEventListener('click', () => {
            playClickSound();
            taskItem.style.textDecoration = 'line-through';
            taskItem.style.color = '#B0B0B0';
        });

        // Create "Delete" button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.style.marginLeft = '10px';
        deleteButton.style.backgroundColor = '#B85042';
        deleteButton.style.color = '#ECDFCC';
        deleteButton.style.border = 'none';
        deleteButton.style.padding = '5px 10px';
        deleteButton.style.cursor = 'pointer';
        deleteButton.style.borderRadius = '5px';
        deleteButton.addEventListener('click', () => {
            playDeleteSound();
            taskList.removeChild(taskItem);
        });

        taskItem.appendChild(doneButton);
        taskItem.appendChild(deleteButton);
        taskList.appendChild(taskItem);

        // Clear the input field after adding a task
        taskInput.value = '';
        playClickSound();
    }
}

addTaskButton.addEventListener('click', addTask);

// Allow pressing "Enter" to add a task
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Alarm Variables and Functions
let alarmTime = null;
let alarmTimeout = null;

function setAlarm() {
    const alarmInput = document.getElementById('alarm-time').value;

    if (alarmInput) {
        const now = new Date();
        const [hours, minutes] = alarmInput.split(':').map(Number);

        // Set alarm time today
        alarmTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);

        // If alarm time has already passed today, set for the next day
        if (alarmTime < now) {
            alarmTime.setDate(alarmTime.getDate() + 1);
        }

        // Clear any existing timeout
        if (alarmTimeout) {
            clearTimeout(alarmTimeout);
        }

        // Calculate the time until the alarm goes off
        const timeUntilAlarm = alarmTime - now;

        // Set a timeout to show the alert when the alarm goes off
        alarmTimeout = setTimeout(() => {
            playAlertSound();
            setTimeout(() => {
                alert("Alarm ringing!");
            }, 100); // Delay alert to ensure sound plays first
        }, timeUntilAlarm);

        alert("Alarm set successfully!");
    } else {
        alert("Please select a time.");
    }
}

document.getElementById('set-alarm').addEventListener('click', setAlarm);