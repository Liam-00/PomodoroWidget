//DOM ELEMENTS
//clock
const clock_minutes = document.getElementById('minutes');
const clock_seconds = document.getElementById('seconds');
//buttons
const button_increase = document.getElementById('increase');
const button_decrease = document.getElementById('decrease');
const button_startstop = document.getElementById('startstop');
const button_workbreak = document.getElementById('mode');
//timer body
const timer_container = document.getElementById('container');
//create audio
const AUDIO = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
//TIME CONSTANTS, main authority of given value
let MAINTIME = 25 * 60;
let TIMERMODE = "WORK";
let TIMERSTATE = false;
//HELPER FUNCTIONS
//update HTML clock element with MAINTIME
const timeSet = () => {
    //calc minutes and seconds frmo MAINTIME
    let min = Math.floor(MAINTIME / 60);
    let sec = MAINTIME - min * 60;
    //format for display in html timer
    clock_minutes.innerHTML = min > 9 ? min.toString() : '0' + min.toString();
    clock_seconds.innerHTML = sec > 9 ? sec.toString() : '0' + sec.toString();
};
//handle each 1000ms time tick
const timeTick = () => {
    //switch TIMERMODE at 0seconds on MAINTIME, else tick MAINTIME down
    if (MAINTIME === 0 && TIMERMODE === 'WORK') {
        AUDIO.play();
        setTimerMode('BREAK');
    }
    else if (MAINTIME === 0 && TIMERMODE === 'BREAK') {
        AUDIO.play();
        setTimerMode('WORK');
    }
    else {
        MAINTIME--;
        timeSet();
    }
};
//increment and decrement time by amount of minutes. ex: 21:54 + 5 = 25:0
const timeIncrement = (amount) => {
    //stop timer
    setTimerState(false);
    //increment to nearest 5 minutes, else set to max time (60)
    if (MAINTIME + (amount * 60) <= 60 * 60) {
        MAINTIME = Math.floor(MAINTIME / (5 * 60)) * (5 * 60) + (amount * 60);
    }
    else {
        MAINTIME = 60 * 60;
    }
    timeSet();
};
const timeDecrement = (amount) => {
    //stop timer
    setTimerState(false);
    //decrement by nearest 5, else cap at lowest time (0)
    if (MAINTIME - (amount * 60) >= 0) {
        MAINTIME = Math.ceil(MAINTIME / (5 * 60)) * (5 * 60) - (amount * 60);
    }
    else {
        MAINTIME = 0;
    }
    timeSet();
};
//WEBWORKER FUNCTIONS
//create webworker
const time_Worker = new Worker('webworker.js');
//event listener to handle incoming ticks from webworker
time_Worker.onmessage = (msg) => {
    timeTick();
};
//start or stop webworker timer
const setTimerState = (state) => {
    //toggle timer active else set to given state
    if (state === undefined) {
        time_Worker.postMessage(undefined);
        TIMERSTATE = TIMERSTATE ? false : true;
        button_startstop.innerHTML = TIMERSTATE ? 'STOP' : 'START';
    }
    else {
        time_Worker.postMessage(state);
        TIMERSTATE = state;
        button_startstop.innerHTML = TIMERSTATE ? 'STOP' : 'START';
    }
};
//MODES
//handle setting or toggling timer mode
const setTimerMode = (mode) => {
    //util function for settting TIMERMODE and handling relevent ui updates
    const setMode = (newMode, time) => {
        TIMERMODE = newMode;
        MAINTIME = time * 60;
        timeSet();
        if (TIMERMODE === 'WORK') {
            button_workbreak.innerHTML = 'BREAK';
            timer_container.classList.replace('container-break', 'container-work');
        }
        else if (TIMERMODE === 'BREAK') {
            button_workbreak.innerHTML = 'WORK';
            timer_container.classList.replace('container-work', 'container-break');
        }
    };
    //toggle mode if input undefined, else set given value. Timer stops on changing back to WORK
    if (mode === undefined) {
        setMode(TIMERMODE === 'WORK' ? 'BREAK' : 'WORK', TIMERMODE === 'WORK' ? 5 : 25);
        if (TIMERMODE === 'WORK') {
            setTimerState(false);
        }
    }
    else if (mode === 'WORK') {
        setTimerState(false);
        setMode('WORK', 25);
    }
    else if (mode === 'BREAK') {
        setMode('BREAK', 5);
    }
};
//EVENTLISTENERS
button_increase.addEventListener('click', () => {
    timeIncrement(5);
});
button_decrease.addEventListener('click', () => {
    timeDecrement(5);
});
button_startstop.addEventListener('click', () => {
    setTimerState();
});
button_workbreak.addEventListener('click', () => {
    setTimerMode();
});
