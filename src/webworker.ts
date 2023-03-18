let timerActive = false
let timer = -1



let drift: number = 0;

let expectedTime: number

//timer logic
const time = () => {
    
    if (timerActive) {
        if (expectedTime === null) {
            console.log('setting first expected time')
            expectedTime = Date.now() + 1000
        }
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


//timer controls
const startTimer = () => {
    timerActive = true
    time()
}
const stopTimer = () => {
    clearInterval(timer)
    timerActive = false
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

