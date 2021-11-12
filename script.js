class countdown {
  constructor(time = 25) {
    this.time = time;
    this.state = false;
    this.mode = "WORK";

    //ui counter access and internal counter value
    this.UIminutes = document.getElementById("minutes");
    this.UIseconds = document.getElementById("seconds");
    this.minutes = this.UIminutes.innerHTML;
    this.seconds = this.UIminutes.innerHTML;

    //initialize timer starting value
    this.updateTime(25, 0);

    //button ui text access
    this.startB = document.getElementById("startstop");
    this.modeB = document.getElementById("mode");
    this.increaseB = document.getElementById("increase");
    this.decreaseB = document.getElementById("decrease");

    //initialize setInterval pointer
    this.looper = null;
    
    //initialize audio alert
    this.audioAlert = new Audio("https://actions.google.com/sounds/v1/cartoon/pop.ogg"); 
    
    //style query selector
    this.background = document.querySelector(".container");
    
  }

  updateTime(min, sec) {
    this.minutes = parseInt(min, 10);
    this.seconds = parseInt(sec, 10);
    this.UIminutes.innerHTML = this.minutes.toString().padStart(2, 0);
    this.UIseconds.innerHTML = this.seconds.toString().padStart(2, 0);
  }

  addTime() {
    var a = 5 * Math.round(this.minutes / 5);
    var i = a + 5;
    if (i <= 60) {
      this.updateTime(i, 0);
    } else {
      this.updateTime(60, 0);
    }
  }

  reduceTime() {
    if (this.minutes - 5 > 0) {
      var a = 5 * Math.round(this.minutes / 5);
      this.updateTime(a - 5, 0);
    } else {
      this.updateTime(0, 0);
    }
  }
  
  
  //conditionally increment the time, this function is meant to be looped by timeLoop. 
  incrementTime() {
    if (this.seconds > 0) {
      this.updateTime(this.minutes, this.seconds - 1);
    } else if (this.minutes > 0) {
      this.updateTime(this.minutes - 1, 59);
    } else {
      //toggle mode when timer hits 00:00. 
      //if the toggled mode is work, then stop the timer.
      this.audioAlert.play();
      this.toggleMode();
      if(this.mode == "WORK"){
        this.toggleStart();
      }
    }
  }

  timeLoop(toggle) {
    if (toggle == true && (this.minutes > 0 || this.seconds > 0)) {
      this.incrementTime();
      this.looper = setInterval(this.incrementTime.bind(this), 1000);
    } else if (toggle == false) {
      clearInterval(this.looper);
    }
  }

  toggleStart() {
    if (this.state == false) {
      this.startB.innerHTML = "STOP";
      this.state = true;
      this.timeLoop(true);
    } else if (this.state == true) {
      this.startB.innerHTML = "START";
      this.state = false;
      this.timeLoop(false);
    }
  }

  toggleMode() {
    if (this.mode == "WORK") {
      this.modeB.innerHTML = "WORK";
      this.mode = "BREAK";
      this.background.style.backgroundColor = "#2dadb8";
      this.updateTime(5,0);
    } else if (this.mode == "BREAK") {
      this.modeB.innerHTML = "BREAK";
      this.mode = "WORK";
      this.background.style.backgroundColor = "#e14444";
      this.updateTime(25, 0);
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  let mainTimer = new countdown();
  
  document.getElementById("startstop").addEventListener("click", function () {
    mainTimer.toggleStart();
  });
  document.getElementById("mode").addEventListener("click", function () {
    mainTimer.toggleMode();
    console.log("mode");
  });
  document.getElementById("increase").addEventListener("click", function () {
    console.log("up");
    mainTimer.addTime();
  });
  document.getElementById("decrease").addEventListener("click", function () {
    mainTimer.reduceTime();
    console.log("down");
  });
});
