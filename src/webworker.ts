let timerActive = false
let drift = 0
let timer = -1

//timer logic
const time = () => {
    if (timerActive) {        
        let timerNow = Date.now()
        let timeExpected = timerNow + 1000
        timer = setTimeout(
            () => {
                //send tick
                postMessage(true)

                //calc drift and recurse
                drift = Date.now() - timeExpected
                time()
            },
            1000 - drift
        )
    }
}


//timer controls
const startTimer = () => {
    timerActive = true
    time()
}
const stopTimer = () => {
    clearTimeout(timer)
    timerActive = false;
    timer = -1
    drift = 0
}
const toggleTimer = () => {
    if (timerActive) {
        stopTimer()
    } else if (!timerActive) {
        startTimer()
    }
}

//message handler
onmessage = (msg) => {
        if (msg.data === true) {
            startTimer()
        } else if (msg.data === false) {
            stopTimer()
        } else {
            toggleTimer()
        }
}

