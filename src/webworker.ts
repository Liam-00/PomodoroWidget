//VARIABLES
//note, webworker is being treated like a closure with variables scoped to it's own environment
let timerActive = false
let timer = -1

let drift: number = 0
let expectedTime: number = null


//TIMER LOGIC
const time = () => {
    
    if (timerActive) {
        //on first timer call, set first expected time
        if (expectedTime === null) {
            expectedTime = Date.now() + 1000
        }

        //start timer, in callback expected time for next cycle is updated
        //and excess time taken is set as drift
        //subtracting drift from next cycle means timer stays consistant
        timer = setTimeout(
            () => {
                postMessage(true)
                expectedTime += 1000
                drift = 1000 - (expectedTime - Date.now())
                console.log(drift)
                time()
            },
            1000 - drift
        )
    }
}


//TIMER CONTROLS
const startTimer = () => {
    timerActive = true
    time()
}
const stopTimer = () => {
    clearInterval(timer)
    timerActive = false
    //reset variables on timer stop
    timer = -1
    expectedTime = null
    drift = 0
}
const toggleTimer = () => {
    if (timerActive) {
        stopTimer()
    } else if (!timerActive) {
        startTimer()
    }
}

//MESSAGE HANDLER
//interacts with script
onmessage = (msg) => {
        if (msg.data === true) {
            startTimer()
        } else if (msg.data === false) {
            stopTimer()
        } else {
            toggleTimer()
        }
}

