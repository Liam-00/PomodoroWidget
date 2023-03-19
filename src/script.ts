//DOM ELEMENTS
//clock
const clock_minutes:HTMLElement = document.getElementById('minutes')!
const clock_seconds:HTMLElement = document.getElementById('seconds')!

//buttons
const button_increase:HTMLElement = document.getElementById('increase')!
const button_decrease:HTMLElement = document.getElementById('decrease')!

const button_startstop:HTMLElement = document.getElementById('startstop')!
const button_workbreak:HTMLElement = document.getElementById('mode')!

//TIME INTERFACES
type MODE = 'WORK' | 'BREAK'

interface TIME {
	min: number
	sec: number
}

let timeDisplay:TIME = {
    min: 0,
    sec: 0
}

//main authority on time
let MAINTIME: number = 25 * 60
let TIMERMODE: MODE = "WORK"
let TIMERSTATE: boolean = false

//update DOM element with given time
const timeSet = ():void => {
    let min = Math.floor(MAINTIME / 60)
    let sec = MAINTIME - min * 60

    clock_minutes.innerHTML = min > 9 ? min.toString() : '0' + min.toString()
    clock_seconds.innerHTML = sec > 9 ? sec.toString() : '0' + sec.toString()
}   



const timeTick = () => {
    if (MAINTIME === 0 && TIMERMODE === 'WORK') {
        setTimerMode('BREAK')
    } else if (MAINTIME === 0 && TIMERMODE === 'BREAK')
        setTimerMode('WORK')
    MAINTIME--
    timeSet()
}

//increment time by amount of minutes. ex: 21:54 + 5 = 25:0
const timeIncrement = (amount: number):void => {
    setTimerState(false)

    if (MAINTIME + (amount * 60) <= 60 * 60) {
        MAINTIME += amount * 60
    } else {
        MAINTIME = 60 * 60
    }

    timeSet()
}

const timeDecrement = (amount: number):void => {
    setTimerState(false)
    
    if (MAINTIME - (amount * 60) >= 0) {
        MAINTIME -= amount * 60
    } else {
        MAINTIME = 0
    }

    timeSet()
}

//WEBWORKER FUNCTIONS
//create webworker
const time_Worker = new Worker('webworker.js')

//set timer
const setTimerState = (state?: boolean):void => {
    if (state === undefined) {
        time_Worker.postMessage(undefined)
        TIMERSTATE = TIMERSTATE ? false : true
        button_startstop.innerHTML = TIMERSTATE ? 'STOP' : 'START'
    } else {
        time_Worker.postMessage(state)
        TIMERSTATE = state
        button_startstop.innerHTML = TIMERSTATE ? 'STOP' : 'START'
    }
}

//set mode
const setTimerMode = (mode?: MODE):void => {
    
    const setMode = (mode: MODE, time: number, ):void => {
        TIMERMODE = mode
        MAINTIME = time * 60
        timeSet()
        button_workbreak.innerHTML = mode
    }
    
    if (mode === undefined) {
        setMode(TIMERMODE === 'WORK' ? 'BREAK' : 'WORK', TIMERMODE === 'WORK' ? 5 : 25)
        if (TIMERMODE === 'WORK') {
            setTimerState(false)
        }

    } else if (mode === 'WORK') {
        setTimerState(false)
        setMode('WORK', 25)
    
    } else if (mode === 'BREAK') {
        setMode('BREAK', 5)
    }
}

time_Worker.onmessage = (msg) => {
    timeTick()
}

//EVENTLISTENERS

button_increase.addEventListener('click', () => {
    timeIncrement(5)
})

button_decrease.addEventListener('click', () => {
    timeDecrement(5)
})

button_startstop.addEventListener('click', () => {
    setTimerState()
})
    
button_workbreak.addEventListener('click', () => {
    setTimerMode()
})
